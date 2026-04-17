#!/usr/bin/env python3
"""
Project Manager CLI - Database operations for natural language project management
"""

import sqlite3
import os
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple


class ProjectManagerDB:
    """SQLite database interface for project management"""

    def __init__(self, db_path: str = ".project-manager/project.db"):
        """Initialize database connection"""
        self.db_path = db_path
        self.conn = None
        self.cursor = None

    def connect(self):
        """Connect to database"""
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row
        self.cursor = self.conn.cursor()

    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()

    def __enter__(self):
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.conn:
            if exc_type is None:
                self.conn.commit()
            else:
                self.conn.rollback()
            self.close()

    # ==================== PROJECT OPERATIONS ====================

    def get_project(self) -> Optional[Dict[str, Any]]:
        """Get the current project (should only be one per directory)"""
        self.cursor.execute("SELECT * FROM projects LIMIT 1")
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def create_project(self, name: str, description: str = "") -> int:
        """Create a new project"""
        self.cursor.execute(
            "INSERT INTO projects (name, description) VALUES (?, ?)",
            (name, description)
        )
        self.conn.commit()
        return self.cursor.lastrowid

    def update_project_status(self, status: str) -> bool:
        """Update project status"""
        self.cursor.execute("UPDATE projects SET status = ? WHERE id = (SELECT id FROM projects LIMIT 1)", (status,))
        self.conn.commit()
        return self.cursor.rowcount > 0

    # ==================== PHASE OPERATIONS ====================

    def add_phase(self, name: str, description: str = "", project_id: Optional[int] = None) -> int:
        """Add a new phase"""
        if project_id is None:
            project = self.get_project()
            if not project:
                raise ValueError("No project found. Initialize project first.")
            project_id = project['id']

        # Get next order_index
        self.cursor.execute(
            "SELECT COALESCE(MAX(order_index), -1) + 1 FROM phases WHERE project_id = ?",
            (project_id,)
        )
        order_index = self.cursor.fetchone()[0]

        self.cursor.execute(
            "INSERT INTO phases (project_id, name, description, order_index) VALUES (?, ?, ?, ?)",
            (project_id, name, description, order_index)
        )
        self.conn.commit()
        return self.cursor.lastrowid

    def get_phase_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        """Find phase by name (fuzzy match)"""
        self.cursor.execute(
            "SELECT * FROM phases WHERE name LIKE ? ORDER BY order_index LIMIT 1",
            (f"%{name}%",)
        )
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def get_phase_by_id(self, phase_id: int) -> Optional[Dict[str, Any]]:
        """Get phase by ID"""
        self.cursor.execute("SELECT * FROM phases WHERE id = ?", (phase_id,))
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def list_phases(self) -> List[Dict[str, Any]]:
        """List all phases in order"""
        self.cursor.execute("SELECT * FROM phases ORDER BY order_index")
        return [dict(row) for row in self.cursor.fetchall()]

    def update_phase_status(self, phase_id: int, status: str) -> bool:
        """Update phase status"""
        self.cursor.execute("UPDATE phases SET status = ? WHERE id = ?", (status, phase_id))
        self.conn.commit()
        return self.cursor.rowcount > 0

    # ==================== FEATURE OPERATIONS ====================

    def add_feature(self, name: str, phase_id: int, description: str = "", priority: str = "medium") -> int:
        """Add a new feature to a phase"""
        # Get next order_index
        self.cursor.execute(
            "SELECT COALESCE(MAX(order_index), -1) + 1 FROM features WHERE phase_id = ?",
            (phase_id,)
        )
        order_index = self.cursor.fetchone()[0]

        self.cursor.execute(
            "INSERT INTO features (phase_id, name, description, order_index, priority) VALUES (?, ?, ?, ?, ?)",
            (phase_id, name, description, order_index, priority)
        )
        self.conn.commit()
        return self.cursor.lastrowid

    def get_feature_by_name(self, name: str, phase_id: Optional[int] = None) -> Optional[Dict[str, Any]]:
        """Find feature by name (fuzzy match)"""
        if phase_id:
            self.cursor.execute(
                "SELECT * FROM features WHERE name LIKE ? AND phase_id = ? ORDER BY order_index LIMIT 1",
                (f"%{name}%", phase_id)
            )
        else:
            self.cursor.execute(
                "SELECT * FROM features WHERE name LIKE ? ORDER BY order_index LIMIT 1",
                (f"%{name}%",)
            )
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def get_feature_by_id(self, feature_id: int) -> Optional[Dict[str, Any]]:
        """Get feature by ID"""
        self.cursor.execute("SELECT * FROM features WHERE id = ?", (feature_id,))
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def list_features(self, phase_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """List features, optionally filtered by phase"""
        if phase_id:
            self.cursor.execute("SELECT * FROM features WHERE phase_id = ? ORDER BY order_index", (phase_id,))
        else:
            self.cursor.execute("SELECT * FROM features ORDER BY phase_id, order_index")
        return [dict(row) for row in self.cursor.fetchall()]

    def update_feature_status(self, feature_id: int, status: str) -> bool:
        """Update feature status"""
        self.cursor.execute("UPDATE features SET status = ? WHERE id = ?", (status, feature_id))
        self.conn.commit()
        return self.cursor.rowcount > 0

    def update_feature_priority(self, feature_id: int, priority: str) -> bool:
        """Update feature priority"""
        self.cursor.execute("UPDATE features SET priority = ? WHERE id = ?", (priority, feature_id))
        self.conn.commit()
        return self.cursor.rowcount > 0

    # ==================== TASK OPERATIONS ====================

    def add_task(
        self,
        name: str,
        feature_id: int,
        description: str = "",
        priority: str = "medium",
        parent_task_id: Optional[int] = None
    ) -> int:
        """Add a new task to a feature"""
        # Get next order_index
        self.cursor.execute(
            "SELECT COALESCE(MAX(order_index), -1) + 1 FROM tasks WHERE feature_id = ? AND parent_task_id IS ?",
            (feature_id, parent_task_id)
        )
        order_index = self.cursor.fetchone()[0]

        self.cursor.execute(
            """INSERT INTO tasks
               (feature_id, parent_task_id, name, description, order_index, priority)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (feature_id, parent_task_id, name, description, order_index, priority)
        )
        self.conn.commit()
        return self.cursor.lastrowid

    def get_task_by_name(self, name: str, feature_id: Optional[int] = None) -> Optional[Dict[str, Any]]:
        """Find task by name (fuzzy match)"""
        if feature_id:
            self.cursor.execute(
                "SELECT * FROM tasks WHERE name LIKE ? AND feature_id = ? ORDER BY order_index LIMIT 1",
                (f"%{name}%", feature_id)
            )
        else:
            self.cursor.execute(
                "SELECT * FROM tasks WHERE name LIKE ? ORDER BY order_index LIMIT 1",
                (f"%{name}%",)
            )
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def get_task_by_id(self, task_id: int) -> Optional[Dict[str, Any]]:
        """Get task by ID"""
        self.cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def list_tasks(self, feature_id: Optional[int] = None, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """List tasks, optionally filtered by feature and/or status"""
        query = "SELECT * FROM tasks WHERE 1=1"
        params = []

        if feature_id:
            query += " AND feature_id = ?"
            params.append(feature_id)

        if status:
            query += " AND status = ?"
            params.append(status)

        query += " ORDER BY feature_id, order_index"

        self.cursor.execute(query, params)
        return [dict(row) for row in self.cursor.fetchall()]

    def update_task_status(self, task_id: int, status: str) -> bool:
        """Update task status"""
        self.cursor.execute("UPDATE tasks SET status = ? WHERE id = ?", (status, task_id))
        self.conn.commit()
        return self.cursor.rowcount > 0

    def update_task_priority(self, task_id: int, priority: str) -> bool:
        """Update task priority"""
        self.cursor.execute("UPDATE tasks SET priority = ? WHERE id = ?", (priority, task_id))
        self.conn.commit()
        return self.cursor.rowcount > 0

    def assign_task(self, task_id: int, assigned_to: str) -> bool:
        """Assign task to someone"""
        self.cursor.execute("UPDATE tasks SET assigned_to = ? WHERE id = ?", (assigned_to, task_id))
        self.conn.commit()
        return self.cursor.rowcount > 0

    def block_task(self, task_id: int, reason: str) -> bool:
        """Mark task as blocked with reason"""
        self.cursor.execute(
            "UPDATE tasks SET status = 'blocked', blocked_reason = ? WHERE id = ?",
            (reason, task_id)
        )
        self.conn.commit()
        return self.cursor.rowcount > 0

    # ==================== SEARCH & QUERY OPERATIONS ====================

    def search_items(self, query: str) -> Dict[str, List[Dict[str, Any]]]:
        """Search across all items (phases, features, tasks)"""
        results = {
            'phases': [],
            'features': [],
            'tasks': []
        }

        # Search phases
        self.cursor.execute(
            "SELECT * FROM phases WHERE name LIKE ? OR description LIKE ?",
            (f"%{query}%", f"%{query}%")
        )
        results['phases'] = [dict(row) for row in self.cursor.fetchall()]

        # Search features
        self.cursor.execute(
            "SELECT * FROM features WHERE name LIKE ? OR description LIKE ?",
            (f"%{query}%", f"%{query}%")
        )
        results['features'] = [dict(row) for row in self.cursor.fetchall()]

        # Search tasks
        self.cursor.execute(
            "SELECT * FROM tasks WHERE name LIKE ? OR description LIKE ?",
            (f"%{query}%", f"%{query}%")
        )
        results['tasks'] = [dict(row) for row in self.cursor.fetchall()]

        return results

    def get_hierarchy(self) -> List[Dict[str, Any]]:
        """Get full project hierarchy"""
        self.cursor.execute("SELECT * FROM v_project_hierarchy")
        return [dict(row) for row in self.cursor.fetchall()]

    def get_stats(self) -> Dict[str, Any]:
        """Get project statistics"""
        project = self.get_project()

        # Phase stats
        self.cursor.execute("SELECT * FROM v_phase_stats")
        phase_stats = [dict(row) for row in self.cursor.fetchall()]

        # Feature stats
        self.cursor.execute("SELECT * FROM v_feature_stats")
        feature_stats = [dict(row) for row in self.cursor.fetchall()]

        # Overall stats
        self.cursor.execute("SELECT COUNT(*) FROM phases")
        total_phases = self.cursor.fetchone()[0]

        self.cursor.execute("SELECT COUNT(*) FROM features")
        total_features = self.cursor.fetchone()[0]

        self.cursor.execute("SELECT COUNT(*) FROM tasks")
        total_tasks = self.cursor.fetchone()[0]

        self.cursor.execute("SELECT COUNT(*) FROM tasks WHERE status = 'completed'")
        completed_tasks = self.cursor.fetchone()[0]

        self.cursor.execute("SELECT COUNT(*) FROM tasks WHERE status = 'blocked'")
        blocked_tasks = self.cursor.fetchone()[0]

        return {
            'project': project,
            'totals': {
                'phases': total_phases,
                'features': total_features,
                'tasks': total_tasks,
                'completed_tasks': completed_tasks,
                'blocked_tasks': blocked_tasks,
                'completion_percentage': round(completed_tasks / total_tasks * 100, 2) if total_tasks > 0 else 0
            },
            'phase_stats': phase_stats,
            'feature_stats': feature_stats
        }

    # ==================== UTILITY OPERATIONS ====================

    def get_context_ids(self) -> Tuple[Optional[int], Optional[int]]:
        """
        Get current context (most recent in-progress phase and feature)
        Returns: (phase_id, feature_id)
        """
        # Try to find in-progress phase
        self.cursor.execute(
            "SELECT id FROM phases WHERE status = 'in-progress' ORDER BY updated_at DESC LIMIT 1"
        )
        row = self.cursor.fetchone()
        phase_id = row[0] if row else None

        # If no in-progress phase, get most recently updated
        if not phase_id:
            self.cursor.execute(
                "SELECT id FROM phases ORDER BY updated_at DESC LIMIT 1"
            )
            row = self.cursor.fetchone()
            phase_id = row[0] if row else None

        # Try to find in-progress feature in that phase
        feature_id = None
        if phase_id:
            self.cursor.execute(
                "SELECT id FROM features WHERE phase_id = ? AND status = 'in-progress' ORDER BY updated_at DESC LIMIT 1",
                (phase_id,)
            )
            row = self.cursor.fetchone()
            feature_id = row[0] if row else None

            # If no in-progress feature, get most recently updated
            if not feature_id:
                self.cursor.execute(
                    "SELECT id FROM features WHERE phase_id = ? ORDER BY updated_at DESC LIMIT 1",
                    (phase_id,)
                )
                row = self.cursor.fetchone()
                feature_id = row[0] if row else None

        return phase_id, feature_id


def format_hierarchy_tree(db: ProjectManagerDB, show_completed: bool = False) -> str:
    """Format project hierarchy as a tree"""
    lines = []
    project = db.get_project()

    if not project:
        return "No project initialized"

    lines.append(f"📦 {project['name']} [{project['status']}]")
    if project['description']:
        lines.append(f"   {project['description']}")
    lines.append("")

    phases = db.list_phases()
    for i, phase in enumerate(phases):
        is_last_phase = i == len(phases) - 1
        phase_prefix = "└──" if is_last_phase else "├──"

        status_emoji = {
            'pending': '⏸️',
            'in-progress': '🔄',
            'completed': '✅',
            'cancelled': '❌'
        }.get(phase['status'], '❓')

        lines.append(f"{phase_prefix} {status_emoji} Phase {i+1}: {phase['name']} [{phase['status']}]")

        features = db.list_features(phase['id'])
        for j, feature in enumerate(features):
            is_last_feature = j == len(features) - 1
            feature_indent = "    " if is_last_phase else "│   "
            feature_prefix = "└──" if is_last_feature else "├──"

            feature_emoji = {
                'pending': '⏸️',
                'in-progress': '🔄',
                'completed': '✅',
                'blocked': '🚫',
                'cancelled': '❌'
            }.get(feature['status'], '❓')

            priority_emoji = {
                'low': '🔵',
                'medium': '🟡',
                'high': '🟠',
                'critical': '🔴'
            }.get(feature['priority'], '')

            lines.append(f"{feature_indent}{feature_prefix} {feature_emoji} {priority_emoji} {feature['name']} [{feature['status']}]")

            tasks = db.list_tasks(feature['id'])
            if not show_completed:
                tasks = [t for t in tasks if t['status'] != 'completed']

            for k, task in enumerate(tasks):
                is_last_task = k == len(tasks) - 1
                task_indent = feature_indent + ("    " if is_last_feature else "│   ")
                task_prefix = "└──" if is_last_task else "├──"

                task_emoji = {
                    'todo': '⬜',
                    'in-progress': '🔄',
                    'completed': '✅',
                    'blocked': '🚫',
                    'cancelled': '❌'
                }.get(task['status'], '❓')

                lines.append(f"{task_indent}{task_prefix} {task_emoji} {task['name']} [{task['status']}]")

    return "\n".join(lines)


def export_to_json(db: ProjectManagerDB, output_path: str):
    """Export entire project to JSON"""
    data = {
        'project': db.get_project(),
        'phases': [],
    }

    phases = db.list_phases()
    for phase in phases:
        phase_data = dict(phase)
        phase_data['features'] = []

        features = db.list_features(phase['id'])
        for feature in features:
            feature_data = dict(feature)
            feature_data['tasks'] = db.list_tasks(feature['id'])
            phase_data['features'].append(feature_data)

        data['phases'].append(phase_data)

    with open(output_path, 'w') as f:
        json.dump(data, f, indent=2, default=str)


if __name__ == "__main__":
    import argparse
    import sys

    parser = argparse.ArgumentParser(description='Project Manager CLI')
    parser.add_argument('--action', required=True, help='Action to perform')
    parser.add_argument('--name', help='Name for item')
    parser.add_argument('--description', default='', help='Description for item')
    parser.add_argument('--phase-id', type=int, help='Phase ID')
    parser.add_argument('--feature-id', type=int, help='Feature ID')
    parser.add_argument('--task-id', type=int, help='Task ID')
    parser.add_argument('--level', help='Level: project, phase, feature, task')
    parser.add_argument('--status', help='Status value')
    parser.add_argument('--priority', default='medium', help='Priority: low, medium, high, critical')
    parser.add_argument('--id', type=int, help='Item ID')
    parser.add_argument('--query', help='Search query')
    parser.add_argument('--show-completed', action='store_true', help='Show completed items')
    parser.add_argument('--assigned-to', help='Person to assign task to')
    parser.add_argument('--blocked-reason', help='Reason for blocking task')
    parser.add_argument('--parent-task-id', type=int, help='Parent task ID for subtasks')
    parser.add_argument('--notes', help='Notes/comments for item')

    args = parser.parse_args()

    try:
        with ProjectManagerDB() as db:
            if args.action == 'init':
                if not args.name:
                    print("Error: --name required for init")
                    sys.exit(1)
                project_id = db.create_project(args.name, args.description)
                print(json.dumps({"status": "success", "project_id": project_id, "name": args.name}))

            elif args.action == 'add-phase':
                if not args.name:
                    print("Error: --name required for add-phase")
                    sys.exit(1)
                phase_id = db.add_phase(args.name, args.description)
                print(json.dumps({"status": "success", "phase_id": phase_id, "name": args.name}))

            elif args.action == 'add-feature':
                if not args.name or not args.phase_id:
                    print("Error: --name and --phase-id required for add-feature")
                    sys.exit(1)
                feature_id = db.add_feature(args.name, args.phase_id, args.description, args.priority)
                print(json.dumps({"status": "success", "feature_id": feature_id, "name": args.name}))

            elif args.action == 'add-task':
                if not args.name or not args.feature_id:
                    print("Error: --name and --feature-id required for add-task")
                    sys.exit(1)
                task_id = db.add_task(args.name, args.feature_id, args.description, args.priority, args.parent_task_id)
                print(json.dumps({"status": "success", "task_id": task_id, "name": args.name}))

            elif args.action == 'update-status':
                if not args.level or not args.id or not args.status:
                    print("Error: --level, --id, and --status required for update-status")
                    sys.exit(1)

                if args.level == 'project':
                    success = db.update_project_status(args.status)
                elif args.level == 'phase':
                    success = db.update_phase_status(args.id, args.status)
                elif args.level == 'feature':
                    success = db.update_feature_status(args.id, args.status)
                elif args.level == 'task':
                    success = db.update_task_status(args.id, args.status)
                else:
                    print(f"Error: Invalid level '{args.level}'")
                    sys.exit(1)

                print(json.dumps({"status": "success" if success else "error", "updated": success}))

            elif args.action == 'update-priority':
                if not args.level or not args.id or not args.priority:
                    print("Error: --level, --id, and --priority required for update-priority")
                    sys.exit(1)

                if args.level == 'feature':
                    success = db.update_feature_priority(args.id, args.priority)
                elif args.level == 'task':
                    success = db.update_task_priority(args.id, args.priority)
                else:
                    print(f"Error: Invalid level '{args.level}' for priority update")
                    sys.exit(1)

                print(json.dumps({"status": "success" if success else "error", "updated": success}))

            elif args.action == 'assign-task':
                if not args.task_id or not args.assigned_to:
                    print("Error: --task-id and --assigned-to required for assign-task")
                    sys.exit(1)
                success = db.assign_task(args.task_id, args.assigned_to)
                print(json.dumps({"status": "success" if success else "error", "updated": success}))

            elif args.action == 'block-task':
                if not args.task_id or not args.blocked_reason:
                    print("Error: --task-id and --blocked-reason required for block-task")
                    sys.exit(1)
                success = db.block_task(args.task_id, args.blocked_reason)
                print(json.dumps({"status": "success" if success else "error", "updated": success}))

            elif args.action == 'search':
                if not args.query:
                    print("Error: --query required for search")
                    sys.exit(1)
                results = db.search_items(args.query)
                print(json.dumps(results, indent=2))

            elif args.action == 'get-phase':
                if not args.name:
                    print("Error: --name required for get-phase")
                    sys.exit(1)
                phase = db.get_phase_by_name(args.name)
                print(json.dumps(phase, indent=2))

            elif args.action == 'get-feature':
                if not args.name:
                    print("Error: --name required for get-feature")
                    sys.exit(1)
                feature = db.get_feature_by_name(args.name, args.phase_id)
                print(json.dumps(feature, indent=2))

            elif args.action == 'get-task':
                if not args.name:
                    print("Error: --name required for get-task")
                    sys.exit(1)
                task = db.get_task_by_name(args.name, args.feature_id)
                print(json.dumps(task, indent=2))

            elif args.action == 'show':
                tree = format_hierarchy_tree(db, args.show_completed)
                print(tree)

            elif args.action == 'stats':
                stats = db.get_stats()
                print(json.dumps(stats, indent=2, default=str))

            elif args.action == 'update-notes':
                if not args.level or not args.id or args.notes is None:
                    print("Error: --level, --id, and --notes required for update-notes")
                    sys.exit(1)

                if args.level == 'phase':
                    db.cursor.execute("UPDATE phases SET notes = ? WHERE id = ?", (args.notes, args.id))
                    success = db.cursor.rowcount > 0
                elif args.level == 'feature':
                    db.cursor.execute("UPDATE features SET notes = ? WHERE id = ?", (args.notes, args.id))
                    success = db.cursor.rowcount > 0
                elif args.level == 'task':
                    db.cursor.execute("UPDATE tasks SET notes = ? WHERE id = ?", (args.notes, args.id))
                    success = db.cursor.rowcount > 0
                else:
                    print(f"Error: Invalid level '{args.level}' for notes update")
                    sys.exit(1)

                db.conn.commit()
                print(json.dumps({"status": "success" if success else "error", "updated": success}))

            elif args.action == 'export':
                if not args.name:
                    print("Error: --name (output path) required for export")
                    sys.exit(1)
                export_to_json(db, args.name)
                print(json.dumps({"status": "success", "exported_to": args.name}))

            else:
                print(f"Error: Unknown action '{args.action}'")
                sys.exit(1)

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}), file=sys.stderr)
        sys.exit(1)
