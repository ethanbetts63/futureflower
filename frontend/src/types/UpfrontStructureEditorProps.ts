export interface StructureEditorProps {
    mode: 'create' | 'edit';
    title: string;
    description: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
    showSkipButton?: boolean; 
}
