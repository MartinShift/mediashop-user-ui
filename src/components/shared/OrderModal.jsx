const OrderModal = ({ show, onClose, onConfirm, product }) => {
    return (
        <>
            {show && <div className="modal-backdrop fade show"></div>}
            <div 
                className={`modal fade ${show ? 'show' : ''}`} 
                style={{ display: show ? 'block' : 'none' }}
                tabIndex="-1"
                role="dialog"
                aria-hidden={!show}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Order</h5>
                            <button type="button" className="close" onClick={onClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to order "{product?.name}"?</p>
                            <p>Price: ${product?.price?.toFixed(2)}</p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={onConfirm}
                            >
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderModal;