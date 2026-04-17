import { useNavigate } from "react-router";

export function useBackNavigation(listPath: string, label: string) {
  const navigate = useNavigate();
  const hasHistory = window.history.length > 1;

  return {
    label: hasHistory ? `← ${label}` : label,
    hasHistory,
    onClick: () => (hasHistory ? navigate(-1) : navigate(listPath)),
  };
}
