import { StyleSheet } from "react-native";

const genericStyles = StyleSheet.create({
    screenContainer: {
        backgroundColor: 'white',
        flex: 1,
    },

    screenHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        marginBottom: 20,
    },
    
    seperator: {
        marginVertical: 10
    },
    
    heading2 : {
        fontWeight: 'bold',
        color: "black",
        fontSize: 20,
    },
    
    heading3 : {
        fontWeight: 'bold',
        color: "black",
        fontSize: 18,
    },

    normalText : {
        color: "black",
        fontSize: 16,
    },

})


export default genericStyles;