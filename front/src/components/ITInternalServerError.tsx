import ITContentBoxWithoutTheme from "@/components/ITContentBoxWithoutTheme.tsx"
import {Flex} from "antd"

// @ts-ignore
import page500 from "@/assets/page_500.svg"

const ITIInternalServerError = () => {
    return (
        <div style={{ padding: '24px' }}>
            <ITContentBoxWithoutTheme>
                <Flex style={{ justifyContent: 'center' }}>
                    <img
                        alt={'404'}
                        src={page500}
                    />
                </Flex>
            </ITContentBoxWithoutTheme>
        </div>
    )
}

export default ITIInternalServerError