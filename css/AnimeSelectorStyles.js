import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    input: {
        height: 40,
        width: 300,
        borderColor: '#fa6981',

        borderWidth: 1,
        marginBottom: 5
    },
    image: {
        width: 175,
        height: 175,
        marginBottom: 20,
        marginHorizontal: 10
    },
    suggestion: {
        flexDirection: 'column',
        alignItems: 'left'
    },
    suggestionImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    matchedAnime: {
        marginTop: 20
    },
    matchedAnimeTitle: {
        fontWeight: 'bold',
        fontSize: 18
    },
    matchButton: {
        width: 200,
        borderRadius: 20, // This makes the button rounded
        backgroundColor: '#e82ecb', // This sets the background color to tomato
        color: '#fff', // This sets the text color to white
        padding: 10,
        margin: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonText: {
        color: '#fff', // This sets the text color to white
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    }
});