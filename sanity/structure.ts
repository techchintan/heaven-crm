import type {StructureResolver} from "sanity/structure";

import {apiVersion} from "./env";
import {
  allCandidatesIcon,
  allClientsIcon,
  allPlacementsIcon,
  allTeamIcon,
  atRiskPlacementsIcon,
  availableCandidatesIcon,
  candidateTypeIcon,
  clientTypeIcon,
  deductedPlacementIcon,
  inactiveClientsIcon,
  inactiveTeamIcon,
  invoicedPlacementIcon,
  notAvailableCandidatesIcon,
  noticePeriodCandidatesIcon,
  onHoldCandidatesIcon,
  paidPlacementIcon,
  pendingPlacementIcon,
  placedCandidatesIcon,
  placementTypeIcon,
  placementsByStatusIcon,
  prospectClientsIcon,
  recentCandidatesIcon,
  recentPlacementsIcon,
  teamMemberTypeIcon,
  activeClientsIcon,
  activeTeamIcon,
} from "./lib/studio-icons";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("ATS Dashboard")
    .items([
      S.listItem()
        .title("Placements")
        .icon(placementTypeIcon)
        .child(
          S.list()
            .title("Placements")
            .items([
              S.listItem()
                .title("All Placements")
                .icon(allPlacementsIcon)
                .child(
                  S.documentTypeList("placement")
                    .title("All Placements")
                    .defaultOrdering([{field: "placementDate", direction: "desc"}]),
                ),
              S.divider(),
              S.listItem()
                .title("By Status")
                .icon(placementsByStatusIcon)
                .child(
                  S.list()
                    .title("Placements by Status")
                    .items([
                      S.listItem()
                        .title("Pending")
                        .icon(pendingPlacementIcon)
                        .child(
                          S.documentTypeList("placement")
                            .title("Pending Placements")
                            .filter('_type == "placement" && revenueStatus == "pending"')
                            .apiVersion(apiVersion)
                            .defaultOrdering([{field: "placementDate", direction: "desc"}]),
                        ),
                      S.listItem()
                        .title("Invoiced")
                        .icon(invoicedPlacementIcon)
                        .child(
                          S.documentTypeList("placement")
                            .title("Invoiced Placements")
                            .filter('_type == "placement" && revenueStatus == "invoiced"')
                            .apiVersion(apiVersion)
                            .defaultOrdering([{field: "placementDate", direction: "desc"}]),
                        ),
                      S.listItem()
                        .title("Paid")
                        .icon(paidPlacementIcon)
                        .child(
                          S.documentTypeList("placement")
                            .title("Paid Placements")
                            .filter('_type == "placement" && revenueStatus == "paid"')
                            .apiVersion(apiVersion)
                            .defaultOrdering([{field: "placementDate", direction: "desc"}]),
                        ),
                      S.listItem()
                        .title("Deducted (Early Exit)")
                        .icon(deductedPlacementIcon)
                        .child(
                          S.documentTypeList("placement")
                            .title("Deducted Placements")
                            .filter('_type == "placement" && revenueStatus == "deducted"')
                            .apiVersion(apiVersion)
                            .defaultOrdering([{field: "placementDate", direction: "desc"}]),
                        ),
                    ]),
                ),
              S.listItem()
                .title("Recent (Last 30 Days)")
                .icon(recentPlacementsIcon)
                .child(
                  S.documentTypeList("placement")
                    .title("Recent Placements")
                    .filter('_type == "placement" && placementDate > $thirtyDaysAgo')
                    .params({
                      thirtyDaysAgo: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0],
                    })
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "placementDate", direction: "desc"}]),
                ),
              S.listItem()
                .title("At Risk (In Probation)")
                .icon(atRiskPlacementsIcon)
                .child(
                  S.documentTypeList("placement")
                    .title("At Risk Placements")
                    .filter(
                      '_type == "placement" && probationEndDate > $today && !defined(exitDate) && revenueStatus != "paid"',
                    )
                    .params({
                      today: new Date().toISOString().split("T")[0],
                    })
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "probationEndDate", direction: "asc"}]),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Candidates")
        .icon(candidateTypeIcon)
        .child(
          S.list()
            .title("Candidates")
            .items([
              S.listItem()
                .title("All Candidates")
                .icon(allCandidatesIcon)
                .child(
                  S.documentTypeList("candidate")
                    .title("All Candidates")
                    .defaultOrdering([{field: "fullName", direction: "asc"}]),
                ),
              S.divider(),
              S.listItem()
                .title("Available Candidates")
                .icon(availableCandidatesIcon)
                .child(
                  S.documentTypeList("candidate")
                    .title("Available Candidates")
                    .filter(
                      '_type == "candidate" && (status == "immediately_available" || status == "available_next_30_days")',
                    )
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "fullName", direction: "asc"}]),
                ),
              S.listItem()
                .title("On Notice Period")
                .icon(noticePeriodCandidatesIcon)
                .child(
                  S.documentTypeList("candidate")
                    .title("On Notice Period Candidates")
                    .filter('_type == "candidate" && status == "on_notice_period"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "fullName", direction: "asc"}]),
                ),
              S.listItem()
                .title("Not Available")
                .icon(notAvailableCandidatesIcon)
                .child(
                  S.documentTypeList("candidate")
                    .title("Not Available Candidates")
                    .filter('_type == "candidate" && status == "not_available"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "fullName", direction: "asc"}]),
                ),
              S.listItem()
                .title("On Hold")
                .icon(onHoldCandidatesIcon)
                .child(
                  S.documentTypeList("candidate")
                    .title("On Hold Candidates")
                    .filter('_type == "candidate" && status == "on_hold"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "fullName", direction: "asc"}]),
                ),
              S.listItem()
                .title("Placed (Joined)")
                .icon(placedCandidatesIcon)
                .child(
                  S.documentTypeList("candidate")
                    .title("Placed Candidates")
                    .filter('_type == "candidate" && status == "placed"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "fullName", direction: "asc"}]),
                ),
              S.divider(),
              S.listItem()
                .title("Recently Added")
                .icon(recentCandidatesIcon)
                .child(
                  S.documentTypeList("candidate")
                    .title("Recent Candidates")
                    .defaultOrdering([{field: "createdAt", direction: "desc"}]),
                ),
            ]),
        ),
      S.listItem()
        .title("Clients")
        .icon(clientTypeIcon)
        .child(
          S.list()
            .title("Clients")
            .items([
              S.listItem()
                .title("All Clients")
                .icon(allClientsIcon)
                .child(
                  S.documentTypeList("client")
                    .title("All Clients")
                    .defaultOrdering([{field: "companyName", direction: "asc"}]),
                ),
              S.divider(),
              S.listItem()
                .title("Active Clients")
                .icon(activeClientsIcon)
                .child(
                  S.documentTypeList("client")
                    .title("Active Clients")
                    .filter('_type == "client" && status == "active"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "companyName", direction: "asc"}]),
                ),
              S.listItem()
                .title("Inactive Clients")
                .icon(inactiveClientsIcon)
                .child(
                  S.documentTypeList("client")
                    .title("Inactive Clients")
                    .filter('_type == "client" && status == "inactive"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "companyName", direction: "asc"}]),
                ),
              S.listItem()
                .title("Prospects")
                .icon(prospectClientsIcon)
                .child(
                  S.documentTypeList("client")
                    .title("Prospects")
                    .filter('_type == "client" && status == "prospect"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "companyName", direction: "asc"}]),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Team Members")
        .icon(teamMemberTypeIcon)
        .child(
          S.list()
            .title("Team")
            .items([
              S.listItem()
                .title("All Team Members")
                .icon(allTeamIcon)
                .child(
                  S.documentTypeList("teamMember")
                    .title("All Team Members")
                    .defaultOrdering([{field: "name", direction: "asc"}]),
                ),
              S.divider(),
              S.listItem()
                .title("Active Members")
                .icon(activeTeamIcon)
                .child(
                  S.documentTypeList("teamMember")
                    .title("Active Team Members")
                    .filter('_type == "teamMember" && isActive == true')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "name", direction: "asc"}]),
                ),
              S.listItem()
                .title("Inactive Members")
                .icon(inactiveTeamIcon)
                .child(
                  S.documentTypeList("teamMember")
                    .title("Inactive Team Members")
                    .filter('_type == "teamMember" && isActive != true')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "name", direction: "asc"}]),
                ),
            ]),
        ),
    ]);
