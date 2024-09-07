import { writable } from 'svelte/store';

export const organizationSettings = writable({
    notificationEmails: true
});

export function updateOrganizationName() {
    console.log('Organization name updated');
    // TODO: Implement API call to update organization name
}

export function toggleSetting(setting: keyof typeof organizationSettings) {
    organizationSettings.update(settings => ({
        ...settings,
        [setting]: !settings[setting]
    }));
}
