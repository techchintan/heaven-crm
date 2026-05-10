# HeavenPro CRM - Design System Documentation

## Overview

This document provides a comprehensive guide to the HeavenPro CRM design system, built on **shadcn/ui** components. All UI elements follow Tailwind CSS utility-first principles with semantic color tokens for maintainability and consistency.

---

## Core Principles

### 1. **Component-First Development**
- Use shadcn/ui components as the foundation for all UI elements
- Compose complex interfaces from simpler, reusable components
- Avoid custom HTML where shadcn components exist

### 2. **Semantic Design Tokens**
- Use semantic color classes: `bg-primary`, `text-muted-foreground`, `border-border`
- Never use raw colors: avoid `bg-blue-500`, use `bg-primary` instead
- Supports automatic light/dark mode switching

### 3. **Responsive Design**
- Mobile-first approach with Tailwind responsive prefixes: `md:`, `lg:`, `xl:`
- All layouts tested at 375px (mobile), 768px (tablet), 1024px (desktop)
- Use `hidden md:flex` patterns for responsive visibility

### 4. **Accessibility**
- All interactive elements have proper ARIA labels
- Color is never the only indicator of status (combine with icons/text)
- Minimum touch targets: 44x44px for buttons
- Proper heading hierarchy (h1 → h2 → h3, never skip levels)

---

## Layout System

### Spacing Scale
```
0 = 0px
1 = 0.25rem (4px)
2 = 0.5rem (8px)
3 = 0.75rem (12px)
4 = 1rem (16px)
6 = 1.5rem (24px)
8 = 2rem (32px)
12 = 3rem (48px)
16 = 4rem (64px)
```

### Gap vs Spacing
```tsx
// ✅ Correct: Use gap for flex/grid spacing
<div className="flex gap-4">
  <Item />
  <Item />
</div>

// ❌ Wrong: Don't use space-y-* or space-x-*
<div className="space-y-4">
  <Item />
  <Item />
</div>
```

### Layout Method Priority
1. **Flexbox** (90% of cases): `flex items-center justify-between gap-4`
2. **CSS Grid** (complex 2D layouts): `grid grid-cols-3 gap-4`
3. **Avoid**: Floats, absolute positioning (except for overlays)

---

## Color System

### Semantic Colors
| Token | Usage | Light | Dark |
|-------|-------|-------|------|
| `primary` | CTAs, active states | Blue-600 | Blue-500 |
| `secondary` | Alternative actions | Gray-600 | Gray-400 |
| `destructive` | Delete/cancel actions | Red-600 | Red-500 |
| `muted` | Disabled, secondary text | Gray-500 | Gray-400 |
| `success` | Positive status | Green-600 | Green-500 |
| `warning` | Caution, pending | Amber-600 | Amber-500 |
| `info` | Informational | Blue-500 | Blue-400 |

### Usage Examples
```tsx
// ✅ Correct: Semantic tokens
<div className="bg-primary text-primary-foreground">Primary Action</div>
<span className="text-muted-foreground">Muted text</span>

// ❌ Wrong: Raw colors
<div className="bg-blue-500 text-white">Primary Action</div>
<span className="text-gray-500">Muted text</span>
```

---

## Typography

### Font Stack
- **Headings & UI**: Geist Sans (default system font)
- **Code**: Geist Mono

### Type Scale
| Element | Class | Size | Weight | Line-height |
|---------|-------|------|--------|------------|
| Page Title | `text-4xl` | 36px | 700 | 1.1 |
| Section Title | `text-2xl` | 24px | 700 | 1.2 |
| Card Title | `text-lg` | 18px | 600 | 1.3 |
| Body | `text-base` | 16px | 400 | 1.5 |
| Small | `text-sm` | 14px | 400 | 1.4 |
| Tiny | `text-xs` | 12px | 500 | 1.3 |

### Usage
```tsx
<h1 className="text-4xl font-bold">Main Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<p className="text-base text-muted-foreground">Body text</p>
```

---

## Component Library

### 1. **StatsCard** - Key Metrics Display
Displays important metrics with optional trend indicators and icons.

**Props:**
```typescript
interface StatsCardProps {
  title: string;              // Metric label
  value: string | number;     // Primary value
  description?: string;       // Supporting text
  icon?: LucideIcon;         // Optional icon
  trend?: { value: number; isPositive: boolean };
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}
```

**Examples:**
```tsx
// Basic usage
<StatsCard
  title="Total Revenue"
  value="₹2,45,000"
  icon={TrendingUpIcon}
/>

// With trend indicator
<StatsCard
  title="Active Placements"
  value="24"
  description="Last 30 days"
  trend={{ value: 12.5, isPositive: true }}
  variant="success"
/>
```

### 2. **StatusBadge** - Status Display
Semantic status indicator using shadcn Badge component.

**Props:**
```typescript
interface StatusBadgeProps {
  status: string;
  variant?: "placement" | "candidate" | "client";
  className?: string;
}
```

**Placement Statuses:**
- `pending` → Gray badge
- `invoiced` → Blue outline badge
- `paid` → Green badge
- `deducted` → Red badge
- `partially_paid` → Amber outline badge

**Examples:**
```tsx
<StatusBadge status="paid" variant="placement" />
<StatusBadge status="available" variant="candidate" />
<StatusBadge status="active" variant="client" />
```

### 3. **Header** - Page Navigation Bar
Top navigation with title, search, refresh, and notifications.

**Props:**
```typescript
interface HeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  className?: string;
}
```

**Example:**
```tsx
<Header
  title="Placements"
  subtitle="Manage all active placements"
  onRefresh={async () => revalidatePath('/placements')}
/>
```

### 4. **Sidebar** - Main Navigation
Persistent navigation with grouped sections and user profile.

**Features:**
- Active route highlighting
- External link indicators
- User profile section
- Logo/branding

**Example:**
```tsx
<aside className="flex h-screen flex-col gap-6">
  <Sidebar />
  <main>{children}</main>
</aside>
```

### 5. **DataCard** - Content Container
Flexible card for displaying tables, lists, and other content.

**Props:**
```typescript
interface DataCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  isLoading?: boolean;
}
```

**Example:**
```tsx
<DataCard
  title="Recent Placements"
  description="Last 10 placements"
  footer={<Pagination {...paginationProps} />}
>
  <PlacementsTable data={data} />
</DataCard>
```

### 6. **TableSkeleton** - Loading State
Loading placeholder for data tables.

**Props:**
```typescript
interface TableSkeletonProps {
  rows?: number;      // Default: 5
  columns?: number;   // Default: 4
  className?: string;
}
```

**Example:**
```tsx
{isLoading ? (
  <TableSkeleton rows={8} columns={5} />
) : (
  <DataTable data={data} />
)}
```

### 7. **PageAlert** - System Messages
Full-width alerts for page-level feedback.

**Props:**
```typescript
interface PageAlertProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  className?: string;
  onDismiss?: () => void;
}
```

**Example:**
```tsx
<PageAlert
  type="success"
  title="Placement Created"
  message="The new placement has been successfully created and invoiced."
  onDismiss={() => setShowAlert(false)}
/>
```

---

## shadcn/ui Component Usage

### Button
```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="lg">Large</Button>
<Button size="sm">Small</Button>
<Button size="icon">✕</Button>

// States
<Button disabled>Disabled</Button>
<Button data-icon="inline-start"><Icon /> Text</Button>
```

### Input & Label
```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
  />
</div>
```

### Card
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Table
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Dialog
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Select
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Badge
```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Avatar
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="https://..." alt="Name" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Common Patterns

### 1. Form Layouts
```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name">Full Name</Label>
    <Input id="name" placeholder="John Doe" />
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="phone">Phone</Label>
      <Input id="phone" type="tel" />
    </div>
  </div>

  <Button type="submit">Submit</Button>
</form>
```

### 2. Data Table
```tsx
<Card>
  <CardHeader>
    <CardTitle>Data Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        {/* Header rows */}
      </TableHeader>
      <TableBody>
        {/* Body rows */}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

### 3. Dashboard Grid
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <StatsCard title="Metric 1" value="100" />
  <StatsCard title="Metric 2" value="200" />
  <StatsCard title="Metric 3" value="300" />
  <StatsCard title="Metric 4" value="400" />
</div>
```

### 4. Loading State
```tsx
{isLoading ? (
  <TableSkeleton rows={5} columns={4} />
) : (
  <DataTable data={data} />
)}
```

### 5. Responsive Sidebar Layout
```tsx
<div className="flex h-screen">
  <aside className="hidden w-60 border-r lg:flex lg:flex-col">
    <Sidebar />
  </aside>
  <main className="flex-1 overflow-auto">
    <Header title="Page Title" />
    <div className="p-6">{children}</div>
  </main>
</div>
```

---

## Best Practices

### ✅ Do's
- Use semantic color tokens for consistency
- Compose components from shadcn/ui
- Apply responsive prefixes for mobile-first design
- Use `gap` for spacing in flex/grid layouts
- Implement proper loading states with Skeleton
- Use proper heading hierarchy
- Add ARIA labels to interactive elements
- Test components at multiple breakpoints

### ❌ Don'ts
- Mix raw colors with semantic tokens
- Use `space-x-*` or `space-y-*` classes
- Build custom HTML when shadcn component exists
- Hardcode size values (use Tailwind scale)
- Skip responsive design implementation
- Use color alone for status indication
- Nest heading levels without proper hierarchy
- Forget accessibility attributes

---

## Performance Tips

1. **Code Splitting**: Place large data components in separate files
2. **Lazy Loading**: Use `React.lazy()` for non-critical routes
3. **Memoization**: Use `React.memo()` for expensive table rows
4. **Image Optimization**: Use Next.js `Image` component
5. **Caching**: Leverage ISR and revalidation for data fetching

---

## Customization

### Theme Modification
Edit `/app/globals.css` to modify color tokens:
```css
@theme inline {
  --color-primary: your-color;
  --color-secondary: your-color;
  /* ... other tokens */
}
```

### Component Extension
Create wrapper components for domain-specific needs:
```tsx
export function PlacementStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} variant="placement" />;
}
```

---

## Resources

- **shadcn/ui Docs**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com
- **Component Library**: `/components/ui`
- **Custom Components**: `/components` (organized by feature)

---

## Support

For questions or suggestions regarding the design system, please refer to the component documentation or create an issue in the project repository.
