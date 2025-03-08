import {
	PUBLIC_PLAUSIBLE_DOMAIN,
	PUBLIC_PLAUSIBLE_HOST_URL,
} from '$env/static/public'
import Plausible from 'plausible-tracker'

export enum CustomEvents {
	CREATE_LINK = 'CreateLink',
	CREATE_LINK_FAIL = 'CreateLinkFail',

	ONBOARDING_IMPORT_WORKSPACE = 'OnBoarding:ImportWorkspace',
	ONBOARDING_CREATE_WORKSPACE = 'OnBoarding:CreateWorkspace',

	ONBOARDING_USE_INSPIRED_WORKSPACE_NAME = 'OnBoarding:UseInspiredWorkspaceName',
	ONBOARDING_IMPORT_WORKSPACE_FAIL = 'OnBoarding:ImportWorkspaceFail',
	ONBOARDING_CREATE_WORKSPACE_FAIL = 'OnBoarding:CreateWorkspaceFail',
	ONBOARDING_CREATE_API_FAIL = 'OnBoarding:CreateApiFail',

	ONBOARDING_GO_TO_DASHBOARD = 'OnBoarding:GoToDashboard',

	COLLAPSE_SIDEBAR = 'CollapseSidebar',
	EXPAND_SIDEBAR = 'ExpandSidebar',

	OPEN_WORKSPACE_SELECTOR_DIALOG = 'OpenWorkspaceSelectorDialog',
	CHANGE_WORKSPACE = 'ChangeWorkspace',

	CREATE_WORKSPACE = 'CreateWorkspace',
	CREATE_WORKSPACE_FAIL = 'CreateWorkspaceFail',
	CREATE_WORKSPACE_API_FAIL = 'CreateWorkspaceAPIFail',

	IMPORT_WORKSPACE = 'ImportWorkspace',
	IMPORT_WORKSPACE_FAIL = 'ImportWorkspaceFail',

	EXPORT_WORKSPACE = 'ExportWorkspace',

	LINK_SEARCH_INPUT = 'LinkSearchInput',

	DELETE_LINK = 'DeleteLink',
	DELETE_LINK_FAIL = 'DeleteLinkFail',

	HOTKEY_C = 'HotKey:c',
	HOTKEY_D = 'HotKey:d',
	HOTKEY_SLASH = 'HotKey:/',

	CHANGE_LINK_DISPLAY_ORDERING = 'ChangeLinkDisplayOrdering',

	SHOW_LINK_QR_CODE_DIALOG = 'ShowLinkQRCodeDialog',

	LINK_PAGINATION_PAGE_CHANGE = 'LinkPaginationPageChange',
}

export const plausible = Plausible({
	domain: PUBLIC_PLAUSIBLE_DOMAIN,
	apiHost: PUBLIC_PLAUSIBLE_HOST_URL,
})
