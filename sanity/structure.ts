import type {StructureResolver} from "sanity/structure";
import {DocumentsIcon, UsersIcon, CaseIcon, UserIcon, SearchIcon} from "@sanity/icons";

import {apiVersion} from "./env";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("CRM Dashboard")
    .items([
      S.listItem()
        .title("Placements")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Placements")
            .items([
              S.listItem()
                .title("All Placements")
                .icon(DocumentsIcon)
                .child(
                  S.documentTypeList("placement")
                    .title("All Placements")
                    .defaultOrdering([{field: "placementDate", direction: "desc"}]),
                ),
              S.divider(),
              S.listItem()
                .title("By Status")
                .icon(SearchIcon)
                .child(
                  S.list()
                    .title("Placements by Status")
                    .items([
                      S.listItem()
                        .title("Pending")
                        .child(
                          S.documentTypeList("placement")
                            .title("Pending Placements")
                            .filter('_type == "placement" && revenueStatus == "pending"')
                            .apiVersion(apiVersion)
                            .defaultOrdering([{field: "placementDate", direction: "desc"}]),
                        ),
                      S.listItem()
                        .title("Invoiced")
                        .child(
                          S.documentTypeList("placement")
                            .title("Invoiced Placements")
                            .filter('_type == "placement" && revenueStatus == "invoiced"')
                            .apiVersion(apiVersion)
                            .defaultOrdering([{field: "placementDate", direction: "desc"}]),
                        ),
                      S.listItem()
                        .title("Paid")
                        .child(
                          S.documentTypeList("placement")
                            .title("Paid Placements")
                            .filter('_type == "placement" && revenueStatus == "paid"')
                            .apiVersion(apiVersion)
                            .defaultOrdering([{field: "placementDate", direction: "desc"}]),
                        ),
                      S.listItem()
                        .title("Deducted (Early Exit)")
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
        .icon(UsersIcon)
        .child(
          S.list()
            .title("Candidates")
            .items([
              S.listItem()
                .title("All Candidates")
                .icon(UsersIcon)
                .child(
                  S.documentTypeList("candidate")
                    .title("All Candidates")
                    .defaultOrdering([{field: "fullName", direction: "asc"}]),
                ),
              S.divider(),
              S.listItem()
                .title("Available Candidates")
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
                .title("On Notice Period Candidates")
                .child(
                  S.documentTypeList("candidate")
                    .title("On Notice Period Candidates")
                    .filter('_type == "candidate" && status == "on_notice_period"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "fullName", direction: "asc"}]),
                ),
              S.listItem()
                .title("Not Available")
                .child(
                  S.documentTypeList("candidate")
                    .title("Not Available Candidates")
                    .filter('_type == "candidate" && status == "not_available"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "fullName", direction: "asc"}]),
                ),
              S.listItem()
                .title("On Hold Candidates")
                .child(
                  S.documentTypeList("candidate")
                    .title("On Hold Candidates")
                    .filter('_type == "candidate" && status == "on_hold"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "fullName", direction: "asc"}]),
                ),
              S.listItem()
                .title("Placed Candidates (Joined)")
                .child(
                  S.documentTypeList("candidate")
                    .title("Placed Candidates (Joined)")
                    .filter('_type == "candidate" && status == "placed"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "fullName", direction: "asc"}]),
                ),

              S.divider(),
              S.listItem()
                .title("Recently Added")
                .child(
                  S.documentTypeList("candidate")
                    .title("Recent Candidates")
                    .defaultOrdering([{field: "createdAt", direction: "desc"}]),
                ),
            ]),
        ),
      S.listItem()
        .title("Clients")
        .icon(CaseIcon)
        .child(
          S.list()
            .title("Clients")
            .items([
              S.listItem()
                .title("All Clients")
                .icon(CaseIcon)
                .child(
                  S.documentTypeList("client")
                    .title("All Clients")
                    .defaultOrdering([{field: "companyName", direction: "asc"}]),
                ),
              S.divider(),
              S.listItem()
                .title("Active Clients")
                .child(
                  S.documentTypeList("client")
                    .title("Active Clients")
                    .filter('_type == "client" && status == "active"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "companyName", direction: "asc"}]),
                ),
              S.listItem()
                .title("Inactive Clients")
                .child(
                  S.documentTypeList("client")
                    .title("Inactive Clients")
                    .filter('_type == "client" && status == "inactive"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "companyName", direction: "asc"}]),
                ),
              S.listItem()
                .title("Prospects")
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
        .icon(UserIcon)
        .child(
          S.list()
            .title("Team")
            .items([
              S.listItem()
                .title("All Team Members")
                .icon(UserIcon)
                .child(
                  S.documentTypeList("teamMember")
                    .title("All Team Members")
                    .defaultOrdering([{field: "name", direction: "asc"}]),
                ),
              S.divider(),
              S.listItem()
                .title("Active Members")
                .child(
                  S.documentTypeList("teamMember")
                    .title("Active Team Members")
                    .filter('_type == "teamMember" && isActive == true')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{field: "name", direction: "asc"}]),
                ),
              S.listItem()
                .title("Inactive Members")
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
