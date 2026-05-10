import type {StructureResolver} from "sanity/structure";
import {
  DocumentsIcon,
  UsersIcon,
  CaseIcon,
  UserIcon,
  SearchIcon,
} from "@sanity/icons";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Heavenpro CRM")
    .items([
      // === PLACEMENTS SECTION ===
      S.listItem()
        .title("Placements")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Placements")
            .items([
              // All placements
              S.listItem()
                .title("All Placements")
                .icon(DocumentsIcon)
                .child(
                  S.documentTypeList("placement")
                    .title("All Placements")
                    .defaultOrdering([
                      {field: "placementDate", direction: "desc"},
                    ])
                ),

              S.divider(),

              // By Status
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
                            .defaultOrdering([
                              {field: "placementDate", direction: "desc"},
                            ])
                        ),
                      S.listItem()
                        .title("Invoiced")
                        .child(
                          S.documentTypeList("placement")
                            .title("Invoiced Placements")
                            .filter('_type == "placement" && revenueStatus == "invoiced"')
                            .defaultOrdering([
                              {field: "placementDate", direction: "desc"},
                            ])
                        ),
                      S.listItem()
                        .title("Paid")
                        .child(
                          S.documentTypeList("placement")
                            .title("Paid Placements")
                            .filter('_type == "placement" && revenueStatus == "paid"')
                            .defaultOrdering([
                              {field: "placementDate", direction: "desc"},
                            ])
                        ),
                      S.listItem()
                        .title("Deducted (Early Exit)")
                        .child(
                          S.documentTypeList("placement")
                            .title("Deducted Placements")
                            .filter('_type == "placement" && revenueStatus == "deducted"')
                            .defaultOrdering([
                              {field: "placementDate", direction: "desc"},
                            ])
                        ),
                    ])
                ),

              // Recent (Last 30 days)
              S.listItem()
                .title("Recent (Last 30 Days)")
                .child(
                  S.documentTypeList("placement")
                    .title("Recent Placements")
                    .filter(
                      '_type == "placement" && placementDate > $thirtyDaysAgo'
                    )
                    .params({
                      thirtyDaysAgo: new Date(
                        Date.now() - 30 * 24 * 60 * 60 * 1000
                      )
                        .toISOString()
                        .split("T")[0],
                    })
                    .defaultOrdering([
                      {field: "placementDate", direction: "desc"},
                    ])
                ),

              // At Risk (Exit within probation period)
              S.listItem()
                .title("At Risk (In Probation)")
                .child(
                  S.documentTypeList("placement")
                    .title("At Risk Placements")
                    .filter(
                      '_type == "placement" && probationEndDate > $today && !defined(exitDate) && revenueStatus != "paid"'
                    )
                    .params({
                      today: new Date().toISOString().split("T")[0],
                    })
                    .defaultOrdering([
                      {field: "probationEndDate", direction: "asc"},
                    ])
                ),
            ])
        ),

      S.divider(),

      // === CANDIDATES SECTION ===
      S.listItem()
        .title("Candidates")
        .icon(UsersIcon)
        .child(
          S.list()
            .title("Candidates")
            .items([
              // All candidates
              S.listItem()
                .title("All Candidates")
                .icon(UsersIcon)
                .child(
                  S.documentTypeList("candidate")
                    .title("All Candidates")
                    .defaultOrdering([{field: "fullName", direction: "asc"}])
                ),

              S.divider(),

              // By Status
              S.listItem()
                .title("Available")
                .child(
                  S.documentTypeList("candidate")
                    .title("Available Candidates")
                    .filter('_type == "candidate" && status == "available"')
                    .defaultOrdering([{field: "fullName", direction: "asc"}])
                ),
              S.listItem()
                .title("Placed")
                .child(
                  S.documentTypeList("candidate")
                    .title("Placed Candidates")
                    .filter('_type == "candidate" && status == "placed"')
                    .defaultOrdering([{field: "fullName", direction: "asc"}])
                ),
              S.listItem()
                .title("In Process")
                .child(
                  S.documentTypeList("candidate")
                    .title("In Process")
                    .filter('_type == "candidate" && status == "in_process"')
                    .defaultOrdering([{field: "fullName", direction: "asc"}])
                ),
              S.listItem()
                .title("On Hold")
                .child(
                  S.documentTypeList("candidate")
                    .title("On Hold")
                    .filter('_type == "candidate" && status == "on_hold"')
                    .defaultOrdering([{field: "fullName", direction: "asc"}])
                ),

              S.divider(),

              // Recently Added
              S.listItem()
                .title("Recently Added")
                .child(
                  S.documentTypeList("candidate")
                    .title("Recent Candidates")
                    .defaultOrdering([{field: "createdAt", direction: "desc"}])
                ),
            ])
        ),

      // === CLIENTS SECTION ===
      S.listItem()
        .title("Clients")
        .icon(CaseIcon)
        .child(
          S.list()
            .title("Clients")
            .items([
              // All clients
              S.listItem()
                .title("All Clients")
                .icon(CaseIcon)
                .child(
                  S.documentTypeList("client")
                    .title("All Clients")
                    .defaultOrdering([{field: "companyName", direction: "asc"}])
                ),

              S.divider(),

              // By Status
              S.listItem()
                .title("Active Clients")
                .child(
                  S.documentTypeList("client")
                    .title("Active Clients")
                    .filter('_type == "client" && status == "active"')
                    .defaultOrdering([{field: "companyName", direction: "asc"}])
                ),
              S.listItem()
                .title("Inactive Clients")
                .child(
                  S.documentTypeList("client")
                    .title("Inactive Clients")
                    .filter('_type == "client" && status == "inactive"')
                    .defaultOrdering([{field: "companyName", direction: "asc"}])
                ),
              S.listItem()
                .title("Prospects")
                .child(
                  S.documentTypeList("client")
                    .title("Prospects")
                    .filter('_type == "client" && status == "prospect"')
                    .defaultOrdering([{field: "companyName", direction: "asc"}])
                ),
            ])
        ),

      S.divider(),

      // === TEAM SECTION ===
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
                    .defaultOrdering([{field: "name", direction: "asc"}])
                ),
              S.divider(),
              S.listItem()
                .title("Active Members")
                .child(
                  S.documentTypeList("teamMember")
                    .title("Active Team Members")
                    .filter('_type == "teamMember" && isActive == true')
                    .defaultOrdering([{field: "name", direction: "asc"}])
                ),
              S.listItem()
                .title("Inactive Members")
                .child(
                  S.documentTypeList("teamMember")
                    .title("Inactive Team Members")
                    .filter('_type == "teamMember" && isActive != true')
                    .defaultOrdering([{field: "name", direction: "asc"}])
                ),
            ])
        ),
    ]);
