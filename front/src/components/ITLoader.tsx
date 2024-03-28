import {Flex, Spin} from "antd"

type ITLoader = {
    style?: object,
    props?: object[]
}

const ITLoader = ({ style, ...props }: ITLoader) => {
    return (
        <Flex
            style={{
                height: '300px',
                alignItems: 'center',
                justifyContent: 'center',
                ...style
            }}
            {...props}
        >
            <Spin/>
        </Flex>
    )
}

export default ITLoader