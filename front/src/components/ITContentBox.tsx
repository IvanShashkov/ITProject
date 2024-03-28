import {useSelector} from "react-redux"
import {RootState} from "@/store/store.ts"

const ITContentBox = ({ children, style, ...props }: any) => {
    const lightTheme = useSelector<RootState>(state => state.initial.lightTheme)

    return (
        <div
            style={{
                boxShadow: '0px 5px 22px 0px rgba(0, 0, 0, 0.04)',
                background: lightTheme ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0)',
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

export default ITContentBox