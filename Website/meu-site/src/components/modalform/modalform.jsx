export default function ModalForm(prop){
  
    if (!prop.open) return null;

    return(
        <>
            <div className="form-overlay">
                <div className="form-card">
                    <header className="form-header">
                    <h2 className="form-title">{prop.header}</h2>
                    <button className="close-btn" onClick={() => prop.setOpen(false)} aria-label="Fechar">×</button>
                    </header>
                    <form className="form-body" onSubmit={prop.handleSubmit}>
                    {prop.children}
                    </form>
                </div>
            </div>
        </>
    )
}