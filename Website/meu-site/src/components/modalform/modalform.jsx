export default function ModalForm(prop){
  
    if (!prop.open) return null;

    const handleClose = () => {
        if (typeof prop.onClose === 'function') return prop.onClose();
        if (typeof prop.setOpen === 'function') return prop.setOpen(false);
        // nothing to call - do nothing
    };

    return(
        <>
            <div className="form-overlay">
                <div className="form-card">
                    <header className="form-header">
                    <h2 className="form-title">{prop.header}</h2>
                    <button className="close-btn" onClick={handleClose} aria-label="Fechar">×</button>
                    </header>
                    <form className="form-body" onSubmit={prop.handleSubmit}>
                    {prop.children}
                    </form>
                </div>
            </div>
        </>
    )
}