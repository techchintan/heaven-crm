/**
 * HeavenPro CRM - Component Reference & Examples
 *
 * This file serves as a quick reference for all available components
 * and their common usage patterns. For detailed documentation,
 * see DESIGN_SYSTEM.md
 */

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

// Sidebar Navigation
import { Sidebar } from "@/components/layout/sidebar";
// <Sidebar />

// Page Header
import { Header } from "@/components/layout/header";
// <Header title="Page Title" subtitle="Description" onRefresh={handleRefresh} />

// ============================================================================
// DATA DISPLAY COMPONENTS
// ============================================================================

// Statistics Card
import { StatsCard } from "@/components/dashboard/stats-card";
// <StatsCard
//   title="Total Revenue"
//   value="₹2,45,000"
//   description="Last 30 days"
//   icon={TrendingUpIcon}
//   trend={{ value: 12.5, isPositive: true }}
//   variant="success"
// />

// Status Badge
import { StatusBadge } from "@/components/ui/status-badge";
// <StatusBadge status="paid" variant="placement" />

// Data Card
import { DataCard } from "@/components/ui/data-card";
// <DataCard
//   title="Recent Placements"
//   description="Last 10 placements"
//   footer={<Pagination />}
// >
//   <PlacementsTable data={data} />
// </DataCard>

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================

// Page Alert
import { PageAlert } from "@/components/ui/page-alert";
// <PageAlert
//   type="success"
//   title="Success"
//   message="Operation completed successfully"
//   onDismiss={() => setShowAlert(false)}
// />

// Table Skeleton (Loading State)
import { TableSkeleton } from "@/components/ui/table-skeleton";
// {isLoading ? <TableSkeleton rows={8} columns={5} /> : <DataTable data={data} />}

// ============================================================================
// SHADCN/UI COMPONENTS (PRE-INSTALLED)
// ============================================================================

// Form Controls
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Data Display
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Navigation
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Overlays & Modals
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Utilities
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Combobox } from "@/components/ui/combobox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";

// ============================================================================
// COMMON PATTERNS
// ============================================================================

/**
 * PATTERN 1: Dashboard Grid Layout
 * Use for displaying multiple metric cards
 */
// <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//   <StatsCard title="Placements" value="24" />
//   <StatsCard title="Candidates" value="156" />
//   <StatsCard title="Clients" value="18" />
//   <StatsCard title="Revenue" value="₹5.2L" />
// </div>

/**
 * PATTERN 2: Form with Validation
 * Use for creating/editing data
 */
// <form className="space-y-6">
//   <div className="space-y-2">
//     <Label htmlFor="name">Full Name</Label>
//     <Input
//       id="name"
//       placeholder="Enter full name"
//       aria-invalid={errors.name ? "true" : "false"}
//     />
//     {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
//   </div>
//   <Button type="submit">Submit</Button>
// </form>

/**
 * PATTERN 3: Data Table with Actions
 * Use for displaying and managing collections
 */
// <Card>
//   <CardHeader>
//     <CardTitle>Placements</CardTitle>
//     <CardDescription>Manage all active placements</CardDescription>
//   </CardHeader>
//   <CardContent>
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Candidate</TableHead>
//           <TableHead>Client</TableHead>
//           <TableHead>Status</TableHead>
//           <TableHead className="text-right">Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {data.map((row) => (
//           <TableRow key={row.id}>
//             <TableCell>{row.candidate}</TableCell>
//             <TableCell>{row.client}</TableCell>
//             <TableCell>
//               <StatusBadge status={row.status} variant="placement" />
//             </TableCell>
//             <TableCell className="text-right">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="sm">...</Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem>Edit</DropdownMenuItem>
//                   <DropdownMenuItem>Delete</DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </CardContent>
// </Card>

/**
 * PATTERN 4: Modal Dialog
 * Use for confirmations and complex interactions
 */
// <Dialog open={isOpen} onOpenChange={setIsOpen}>
//   <DialogTrigger asChild>
//     <Button>Add Placement</Button>
//   </DialogTrigger>
//   <DialogContent>
//     <DialogHeader>
//       <DialogTitle>Create New Placement</DialogTitle>
//       <DialogDescription>
//         Fill in the form below to create a new placement.
//       </DialogDescription>
//     </DialogHeader>
//     {/* Form content */}
//   </DialogContent>
// </Dialog>

/**
 * PATTERN 5: Responsive Navigation
 * Use for main app layout
 */
// <div className="flex h-screen">
//   <aside className="hidden w-60 border-r lg:flex lg:flex-col">
//     <Sidebar />
//   </aside>
//   <main className="flex-1 flex flex-col overflow-hidden">
//     <Header title="Page Title" />
//     <div className="flex-1 overflow-auto p-6">
//       {children}
//     </div>
//   </main>
// </div>

/**
 * PATTERN 6: Filter/Search Bar
 * Use for data filtering and search
 */
// <div className="flex gap-2 flex-col sm:flex-row">
//   <Input
//     placeholder="Search..."
//     value={search}
//     onChange={(e) => setSearch(e.target.value)}
//     className="flex-1"
//   />
//   <Select value={status} onValueChange={setStatus}>
//     <SelectTrigger className="w-40">
//       <SelectValue placeholder="Filter by status" />
//     </SelectTrigger>
//     <SelectContent>
//       <SelectItem value="all">All</SelectItem>
//       <SelectItem value="active">Active</SelectItem>
//       <SelectItem value="inactive">Inactive</SelectItem>
//     </SelectContent>
//   </Select>
// </div>

/**
 * PATTERN 7: Loading State
 * Use while fetching data
 */
// {isLoading ? (
//   <TableSkeleton rows={5} columns={4} />
// ) : error ? (
//   <PageAlert
//     type="error"
//     title="Error Loading Data"
//     message={error.message}
//   />
// ) : (
//   <DataTable data={data} />
// )}

/**
 * PATTERN 8: Empty State
 * Use when no data is available
 */
// <Card>
//   <CardContent className="flex flex-col items-center justify-center py-16">
//     <Users className="h-12 w-12 text-muted-foreground mb-4" />
//     <h3 className="text-lg font-semibold">No candidates found</h3>
//     <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
//   </CardContent>
// </Card>

/**
 * PATTERN 9: Tabs for Content Organization
 * Use for switching between related views
 */
// <Tabs defaultValue="all" className="w-full">
//   <TabsList>
//     <TabsTrigger value="all">All</TabsTrigger>
//     <TabsTrigger value="active">Active</TabsTrigger>
//     <TabsTrigger value="inactive">Inactive</TabsTrigger>
//   </TabsList>
//   <TabsContent value="all">
//     {/* All content */}
//   </TabsContent>
//   <TabsContent value="active">
//     {/* Active content */}
//   </TabsContent>
//   <TabsContent value="inactive">
//     {/* Inactive content */}
//   </TabsContent>
// </Tabs>

/**
 * PATTERN 10: User Actions Footer
 * Use in forms/dialogs for confirmations
 */
// <div className="flex justify-end gap-2 border-t border-border pt-4 mt-6">
//   <Button variant="outline" onClick={handleCancel}>
//     Cancel
//   </Button>
//   <Button onClick={handleSubmit}>
//     Save Changes
//   </Button>
// </div>

// ============================================================================
// COMPONENT FILE STRUCTURE
// ============================================================================

/*
components/
├── layout/
│   ├── sidebar.tsx          - Main navigation
│   └── header.tsx           - Page header
├── dashboard/
│   ├── stats-card.tsx       - Metric display
│   ├── revenue-chart.tsx    - Chart component
│   ├── recruiter-leaderboard.tsx
│   ├── at-risk-placements.tsx
│   └── recent-placements.tsx
├── placements/
│   └── placements-table.tsx - Placements data table
├── candidates/
│   └── candidates-table.tsx - Candidates data table
├── clients/
│   └── clients-table.tsx    - Clients data table
└── ui/
    ├── button.tsx           - shadcn Button
    ├── card.tsx             - shadcn Card
    ├── input.tsx            - shadcn Input
    ├── label.tsx            - shadcn Label
    ├── table.tsx            - shadcn Table
    ├── dialog.tsx           - shadcn Dialog
    ├── select.tsx           - shadcn Select
    ├── badge.tsx            - shadcn Badge
    ├── avatar.tsx           - shadcn Avatar
    ├── ... (other shadcn components)
    ├── status-badge.tsx     - Custom: Status indicator
    ├── data-card.tsx        - Custom: Content container
    ├── table-skeleton.tsx   - Custom: Loading placeholder
    └── page-alert.tsx       - Custom: System messages
*/

// ============================================================================
// UTILITIES & HELPERS
// ============================================================================

import { cn } from "@/lib/utils";           // Class name combiner (for conditional classes)
import { formatCurrency } from "@/lib/format";     // Format currency values
import { formatDate } from "@/lib/format";         // Format dates

// Example usage:
// className={cn(
//   "p-4 rounded-lg",
//   isActive && "bg-primary text-white",
//   disabled && "opacity-50 cursor-not-allowed"
// )}

// ============================================================================
// ICONS (Lucide React)
// ============================================================================

// Import icons as needed:
import { Check, X, AlertCircle, ChevronDown, Plus, Edit2, Trash2, ... } from "lucide-react";

// Use icons in components:
// <Button>
//   <Plus className="h-4 w-4 mr-2" />
//   Add Item
// </Button>

// ============================================================================
// ACCESSIBILITY GUIDELINES
// ============================================================================

/*
1. SEMANTIC HTML
   - Use <button> for actions, <a> for navigation
   - Use proper heading hierarchy: h1 > h2 > h3
   - Use <label> for form inputs

2. ARIA ATTRIBUTES
   - aria-label: For icon-only buttons
   - aria-describedby: To link inputs with descriptions
   - aria-invalid: To indicate validation errors
   - aria-expanded: For collapsible content
   - role="status": For dynamic status updates

3. KEYBOARD NAVIGATION
   - All interactive elements must be keyboard accessible
   - Tab order should follow logical flow
   - Use tabindex only when necessary

4. COLOR & CONTRAST
   - Never use color alone to convey information
   - Combine with icons, text, or patterns
   - Ensure 4.5:1 contrast ratio for text
   - Test with accessibility tools

5. FOCUS INDICATORS
   - Always provide visible focus states
   - Use outline classes: focus:outline-2 focus:outline-offset-2
   - Never remove focus indicators
*/

// ============================================================================
// RESPONSIVE DESIGN BREAKPOINTS
// ============================================================================

/*
Tailwind CSS Breakpoints:
- sm: 640px   (tablets)
- md: 768px   (smaller desktops)
- lg: 1024px  (desktops)
- xl: 1280px  (large desktops)
- 2xl: 1536px (extra large displays)

Mobile-First Approach:
- Default styles for mobile (375px)
- Add sm:, md:, lg: prefixes for larger screens
- Test at multiple breakpoints

Examples:
- hidden md:flex       - Hide on mobile, show on md+
- w-full md:w-1/2      - Full width on mobile, half on md+
- grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  - 1 column on mobile, 2 on tablet, 3 on desktop
*/

export default function ComponentReference() {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">HeavenPro CRM - Component Reference</h1>
      <p className="text-muted-foreground">
        This file contains documentation and examples for all available components.
        See DESIGN_SYSTEM.md for detailed documentation.
      </p>
    </div>
  );
}
