// frontend/src/types/SingleDeliveryStructureEditorProps.ts

export interface SingleDeliveryStructureEditorProps {
    mode: 'create' | 'edit';
    isPaid?: boolean;
    title?: string;
    description?: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
}
