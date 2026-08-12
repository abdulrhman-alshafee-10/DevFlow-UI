# Authentication — Authorization UI Patterns

## What Is It?

**Authorization UI** controls what users **see and can do** based on their role and permissions. This includes hiding buttons, disabling actions, and showing appropriate error messages.

## Why Does It Matter?

- **UX** — Don't show users actions they can't perform
- **Security defense-in-depth** — UI enforcement + backend enforcement
- **Clear feedback** — Tell users why they can't do something

## How Does It Fit into DevFlow?

### Permission-Based Component Rendering

```tsx
// components/auth/permission-gate.tsx
interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ permission, children, fallback }: PermissionGateProps) {
  const { user } = useAuth();
  const { currentOrg } = useAuthStore();

  const hasPermission = useMemo(() =>
    checkPermission(user, currentOrg, permission),
    [user, currentOrg, permission]
  );

  if (!hasPermission) return fallback || null;
  return <>{children}</>;
}

// Usage
<PermissionGate permission="task:create">
  <Button onClick={openCreateModal}>Create Task</Button>
</PermissionGate>

<PermissionGate
  permission="org:manage"
  fallback={<Badge variant="muted">View Only</Badge>}
>
  <Button onClick={openSettings}>Settings</Button>
</PermissionGate>
```

### Role-Based Navigation

```tsx
const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Projects", href: "/projects", icon: Folder },
  { label: "My Tasks", href: "/tasks/my", icon: CheckSquare },
  { label: "Members", href: "/members", icon: Users, requiredRole: "admin" },
  { label: "Settings", href: "/settings", icon: Settings, requiredRole: "owner" },
];

function Sidebar() {
  const { role } = useCurrentMembership();

  return (
    <nav>
      {sidebarItems
        .filter(item => !item.requiredRole || hasMinRole(role, item.requiredRole))
        .map(item => <NavLink key={item.href} {...item} />)}
    </nav>
  );
}
```

## Common Mistakes

1. **UI-only authorization** — Always enforce on the backend too; UI is just UX
2. **Hiding vs disabling** — Sometimes a disabled button with a tooltip is better than hiding
3. **Not handling 403 errors** — Show a meaningful "Access Denied" page
4. **Stale permissions** — Refresh permissions when organization/role changes

## What I Should Be Able to Do Afterward

- [ ] Build a PermissionGate component for conditional rendering
- [ ] Implement role-based navigation and menu items
- [ ] Handle 403 Forbidden responses with user-friendly UI
- [ ] Show disabled states with explanatory tooltips
- [ ] Sync permissions when the user switches organizations
