const SimpleButton = ({ width = "150px", height = "50px", color = "#00A2E8", text = "Click Me", onClick = ()=>{},spacing = 0 }) => {
    const buttonStyle = {
        width,
        height,
        backgroundColor: color,
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "0.3s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        marginLeft: spacing,
        marginRight: spacing,
        zIndex:999
    };

    return (
        <button style={buttonStyle} onClick={()=>onClick()}>
            {text}
        </button>
    );
};

export default SimpleButton;


const SubButton = ({ width = "150px", height = "50px", color = "#00A2E8", text = "Click Me", onClick = ()=>{},spacing = 0 }) => {
    const buttonStyle = {
        width,
        height,
        backgroundColor: "#00000000",
        color: color,
        border: `${color} solid 2px`,
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "0.3s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        marginLeft: spacing,
        marginRight: spacing,
        zIndex:999
    };

    return (
        <button style={buttonStyle} onClick={()=>onClick()}>
            {text}
        </button>
    );
};

export {SubButton};