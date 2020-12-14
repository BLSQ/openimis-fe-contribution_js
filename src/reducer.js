import { parseData, pageInfo, formatServerError, formatGraphQLError } from '@openimis/fe-core';

function reducer(
    state = {
        fetchingPoliciesPremiums: false,
        fetchedPoliciesPremiums: false,
        errorPoliciesPremiums: null,
        policiesPremiumsPageInfo: { totalCount: 0 },
        policiesPremiums: null,
        premium: null,
        contributions: [],
        contributionsPageInfo: { totalCount: 0 },
        fetchingContributions: false,
        fetchedContributions: false,
        errorContributions: null,
        submittingMutation: false,
        mutation: {},
    },
    action,
) {
    switch (action.type) {
        case 'INSUREE_FAMILY_OVERVIEW_REQ':
            return {
                ...state,
                fetchingPoliciesPremiums: false,
                fetchedPoliciesPremiums: false,
                policiesPremiums: null,
                policiesPremiumsPageInfo: { totalCount: 0 },
                errorPoliciesPremiums: null,
                premium: null,
            }
        case 'POLICY_INSUREE_POLICIES_REQ':
        case 'POLICY_FAMILY_POLICIES_REQ':
        case 'CONTRIBUTION_POLICES_PREMIUMS_REQ':
            return {
                ...state,
                fetchingPoliciesPremiums: true,
                fetchedPoliciesPremiums: false,
                policiesPremiums: null,
                policiesPremiumsPageInfo: { totalCount: 0 },
                errorPoliciesPremiums: null,
                premium: null,
            };
        case 'CONTRIBUTION_POLICES_PREMIUMS_RESP':
            return {
                ...state,
                fetchingPoliciesPremiums: false,
                fetchedPoliciesPremiums: true,
                policiesPremiums: parseData(action.payload.data.premiumsByPolicies),
                policiesPremiumsPageInfo: pageInfo(action.payload.data.premiumsByPolicies),
                errorPoliciesPremiums: formatGraphQLError(action.payload)
            };
        case 'CONTRIBUTION_POLICES_PREMIUMS_ERR':
            return {
                ...state,
                fetchingPoliciesPremiums: false,
                errorPoliciesPremiums: formatServerError(action.payload)
            };
        case 'CONTRIBUTION_PREMIUM':
            return {
                ...state,
                premium: action.payload,
            };
        case 'CONTRIBUTION_CONTRIBUTIONS_REQ':
            return {
                ...state,
                fetchingContributions: true,
                fetchedContributions: false,
                contributions: null,
                contributionsPageInfo: { totalCount: 0 },
                errorContributions: null,
            };
        case 'CONTRIBUTION_CONTRIBUTIONS_ERR':
            return {
                ...state,
                fetchingContributions: false,
                errorContributions: formatServerError(action.payload)
            };
        case 'CONTRIBUTION_CONTRIBUTIONS_RESP':
            console.log('CONTRIBUTION_CONTRIBUTIONS', action.payload)
            return {
                ...state,
                fetchingContributions: false,
                fetchedContributions: true,
                contributions: parseData(action.payload.data.premiums),
                contributionsPageInfo: pageInfo(action.payload.data.premiums),
                errorContributions: formatGraphQLError(action.payload)
            };
        default:
            return state;
    }
}

export default reducer;
