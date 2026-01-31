
export default async function ShareWorkflow({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div>
            <h1>Share Workflow {id}</h1>
        </div>
    );
}