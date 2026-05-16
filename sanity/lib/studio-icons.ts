import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  LayoutDashboard,
  ListFilter,
  PauseCircle,
  Receipt,
  Sparkles,
  UserCheck,
  UserCog,
  UserMinus,
  UserPlus,
  Users,
  UserX,
  XCircle,
} from "lucide-react";

import {lucideIcon} from "./icons";

/** Document type icons (match dashboard sidebar). */
export const placementTypeIcon = lucideIcon(FileText);
export const candidateTypeIcon = lucideIcon(Users);
export const clientTypeIcon = lucideIcon(Building2);
export const teamMemberTypeIcon = lucideIcon(UserCog);

/** Structure navigation icons. */
export const dashboardIcon = lucideIcon(LayoutDashboard);
export const allPlacementsIcon = lucideIcon(FileText);
export const placementsByStatusIcon = lucideIcon(ListFilter);
export const pendingPlacementIcon = lucideIcon(Clock);
export const invoicedPlacementIcon = lucideIcon(Receipt);
export const paidPlacementIcon = lucideIcon(CheckCircle2);
export const deductedPlacementIcon = lucideIcon(XCircle);
export const recentPlacementsIcon = lucideIcon(CalendarClock);
export const atRiskPlacementsIcon = lucideIcon(AlertTriangle);

export const allCandidatesIcon = lucideIcon(Users);
export const availableCandidatesIcon = lucideIcon(UserCheck);
export const noticePeriodCandidatesIcon = lucideIcon(Clock);
export const notAvailableCandidatesIcon = lucideIcon(UserX);
export const onHoldCandidatesIcon = lucideIcon(PauseCircle);
export const placedCandidatesIcon = lucideIcon(UserCheck);
export const recentCandidatesIcon = lucideIcon(UserPlus);

export const allClientsIcon = lucideIcon(Building2);
export const activeClientsIcon = lucideIcon(CheckCircle2);
export const inactiveClientsIcon = lucideIcon(UserMinus);
export const prospectClientsIcon = lucideIcon(Sparkles);

export const allTeamIcon = lucideIcon(UserCog);
export const activeTeamIcon = lucideIcon(UserCheck);
export const inactiveTeamIcon = lucideIcon(UserMinus);
