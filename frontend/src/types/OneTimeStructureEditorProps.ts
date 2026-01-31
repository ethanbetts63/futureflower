export interface SingleDeliveryStructureEditorProps {
    mode: 'create' | 'edit';
    title: string;
    description: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
}
