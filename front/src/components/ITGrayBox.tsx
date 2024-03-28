import {useSelector} from "react-redux"
import {RootState} from "@/store/store.ts"

const ITGrayBox = ({ children, style, ...props }: any) => {
    const lightTheme = useSelector<RootState>(state => state.initial.lightTheme)

    return (
        <div
            style={{
                backgroundColor: lightTheme ? '#f5f5f5' : '#141414',
                borderRadius: '12px',
                padding: '12px',
                boxSizing: 'border-box',
                boxShadow: '0px 5px 22px 0px rgba(0, 0, 0, 0.04)',
                ...style
            }}
            {...props}
        >
            {children}
        </div>
    )
}

export default ITGrayBox