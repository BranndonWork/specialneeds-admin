-- Project Manager Database Schema
-- This schema supports: Projects → Phases → Features → Tasks (with subtasks)

-- Projects table (one per .project-manager directory)
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'planning' CHECK(status IN ('planning', 'active', 'on-hold', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phases table (major project divisions)
CREATE TABLE IF NOT EXISTS phases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in-progress', 'completed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Features table (major deliverables within phases)
CREATE TABLE IF NOT EXISTS features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phase_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in-progress', 'completed', 'cancelled', 'blocked')),
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
    estimated_effort TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (phase_id) REFERENCES phases(id) ON DELETE CASCADE
);

-- Tasks table (individual work items, supports subtasks via parent_task_id)
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feature_id INTEGER NOT NULL,
    parent_task_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    status TEXT DEFAULT 'todo' CHECK(status IN ('todo', 'in-progress', 'blocked', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
    assigned_to TEXT,
    blocked_reason TEXT,
    notes TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Tags for cross-cutting concerns
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    color TEXT
);

-- Many-to-many: tasks can have multiple tags
CREATE TABLE IF NOT EXISTS task_tags (
    task_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_phases_project ON phases(project_id);
CREATE INDEX IF NOT EXISTS idx_phases_order ON phases(project_id, order_index);
CREATE INDEX IF NOT EXISTS idx_features_phase ON features(phase_id);
CREATE INDEX IF NOT EXISTS idx_features_order ON features(phase_id, order_index);
CREATE INDEX IF NOT EXISTS idx_tasks_feature ON tasks(feature_id);
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks(feature_id, order_index);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_features_status ON features(status);
CREATE INDEX IF NOT EXISTS idx_phases_status ON phases(status);

-- Triggers to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_project_timestamp
AFTER UPDATE ON projects
BEGIN
    UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_phase_timestamp
AFTER UPDATE ON phases
BEGIN
    UPDATE phases SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_feature_timestamp
AFTER UPDATE ON features
BEGIN
    UPDATE features SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_task_timestamp
AFTER UPDATE ON tasks
BEGIN
    UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to set completed_at when task is marked completed
CREATE TRIGGER IF NOT EXISTS set_task_completed_at
AFTER UPDATE OF status ON tasks
WHEN NEW.status = 'completed' AND OLD.status != 'completed'
BEGIN
    UPDATE tasks SET completed_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- View: Full project hierarchy
CREATE VIEW IF NOT EXISTS v_project_hierarchy AS
SELECT
    p.id as project_id,
    p.name as project_name,
    p.status as project_status,
    ph.id as phase_id,
    ph.name as phase_name,
    ph.order_index as phase_order,
    ph.status as phase_status,
    f.id as feature_id,
    f.name as feature_name,
    f.order_index as feature_order,
    f.status as feature_status,
    f.priority as feature_priority,
    t.id as task_id,
    t.name as task_name,
    t.order_index as task_order,
    t.status as task_status,
    t.priority as task_priority,
    t.parent_task_id,
    t.assigned_to
FROM projects p
LEFT JOIN phases ph ON ph.project_id = p.id
LEFT JOIN features f ON f.phase_id = ph.id
LEFT JOIN tasks t ON t.feature_id = f.id
ORDER BY ph.order_index, f.order_index, t.order_index;

-- View: Task completion stats by feature
CREATE VIEW IF NOT EXISTS v_feature_stats AS
SELECT
    f.id as feature_id,
    f.name as feature_name,
    f.status as feature_status,
    COUNT(t.id) as total_tasks,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
    SUM(CASE WHEN t.status = 'blocked' THEN 1 ELSE 0 END) as blocked_tasks,
    SUM(CASE WHEN t.status = 'in-progress' THEN 1 ELSE 0 END) as in_progress_tasks,
    ROUND(
        CAST(SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS FLOAT) /
        NULLIF(COUNT(t.id), 0) * 100,
        2
    ) as completion_percentage
FROM features f
LEFT JOIN tasks t ON t.feature_id = f.id
GROUP BY f.id;

-- View: Phase completion stats
CREATE VIEW IF NOT EXISTS v_phase_stats AS
SELECT
    ph.id as phase_id,
    ph.name as phase_name,
    ph.status as phase_status,
    COUNT(DISTINCT f.id) as total_features,
    SUM(CASE WHEN f.status = 'completed' THEN 1 ELSE 0 END) as completed_features,
    COUNT(t.id) as total_tasks,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
    ROUND(
        CAST(SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS FLOAT) /
        NULLIF(COUNT(t.id), 0) * 100,
        2
    ) as completion_percentage
FROM phases ph
LEFT JOIN features f ON f.phase_id = ph.id
LEFT JOIN tasks t ON t.feature_id = f.id
GROUP BY ph.id;
