import type {
  CandidateByIdQueryResult,
  CandidatesQueryResult,
  PlacementByIdQueryResult,
  PlacementsByCandidateQueryResult,
  PlacementsByRecruiterQueryResult,
  PlacementsByVendorQueryResult,
  PlacementsQueryResult,
  TeamMemberByIdQueryResult,
  TeamMembersQueryResult,
  VendorByIdQueryResult,
  VendorsQueryResult,
} from "@/sanity.types";
import {sanityFetch} from "./live";
import {
  candidateByIdQuery,
  candidatesQuery,
  placementByIdQuery,
  placementsByCandidateQuery,
  placementsByRecruiterQuery,
  placementsByVendorQuery,
  placementsQuery,
  teamMemberByIdQuery,
  teamMembersQuery,
  vendorByIdQuery,
  vendorsQuery,
} from "./query";

export async function getPlacements(): Promise<PlacementsQueryResult> {
  const {data} = await sanityFetch({query: placementsQuery});
  return data;
}

export async function getCandidates(): Promise<CandidatesQueryResult> {
  const {data} = await sanityFetch({query: candidatesQuery});
  return data;
}

export async function getVendors(): Promise<VendorsQueryResult> {
  const {data} = await sanityFetch({query: vendorsQuery});
  return data;
}

export async function getTeamMembers(): Promise<TeamMembersQueryResult> {
  const {data} = await sanityFetch({query: teamMembersQuery});
  return data;
}

export async function getPlacementById(id: string): Promise<PlacementByIdQueryResult> {
  const {data} = await sanityFetch({query: placementByIdQuery, params: {id}});
  return data;
}

export async function getCandidateById(id: string): Promise<CandidateByIdQueryResult> {
  const {data} = await sanityFetch({query: candidateByIdQuery, params: {id}});
  return data;
}

export async function getVendorById(id: string): Promise<VendorByIdQueryResult> {
  const {data} = await sanityFetch({query: vendorByIdQuery, params: {id}});
  return data;
}

export async function getTeamMemberById(id: string): Promise<TeamMemberByIdQueryResult> {
  const {data} = await sanityFetch({query: teamMemberByIdQuery, params: {id}});
  return data;
}

export async function getPlacementsByCandidate(
  candidateId: string,
): Promise<PlacementsByCandidateQueryResult> {
  const {data} = await sanityFetch({query: placementsByCandidateQuery, params: {candidateId}});
  return data;
}

export async function getPlacementsByVendor(
  vendorId: string,
): Promise<PlacementsByVendorQueryResult> {
  const {data} = await sanityFetch({query: placementsByVendorQuery, params: {vendorId}});
  return data;
}

export async function getPlacementsByRecruiter(
  recruiterId: string,
): Promise<PlacementsByRecruiterQueryResult> {
  const {data} = await sanityFetch({query: placementsByRecruiterQuery, params: {recruiterId}});
  return data;
}
