
const ITContentBoxWithoutTheme = ({ children, style, ...props }: any) => {
    return (
        <div
            style={{
                boxShadow: '0px 5px 22px 0px rgba(0, 0, 0, 0.04)',
                background: 'rgba(255, 255, 255, 1)',
                borderRadius: '12px',
                padding: '24px',
                boxSizing: 'border-box',
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    )
}

export default ITContentBoxWithoutTheme