import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    inputContainer: {
        width: '80%',
        marginTop:20,
        borderColor: '#eeee',
        borderWidth:3.5,
        borderRadius: 100,
        backgroundColor:'white',

    },
    input: {
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius:100,
        marginTop:5,
        paddingVertical: 10,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:25
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2

    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
    textTitle:{
        fontFamily: 'Foundation',
        fontSize: 18,
        alignSelf: 'center',
        margin: 10
    },
    textBody:{
        fontFamily: 'Foundation',
        fontSize: 16,
        alignSelf: 'center',
        marginTop: 20
    },
    submitText:{
        fontSize:22,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        marginVertical : 10
    },
    listTextItem:{
        fontFamily: 'Foundation',
        fontSize: 16,
        alignSelf: "flex-end",
    },
    listSubtitleTextItem:{
        fontFamily: 'Foundation',
        alignSelf: "flex-end",
    },
    inputText: {
        //color: '#0779e4',
        fontWeight: 'bold',
        marginLeft:5
    },
    image:{
        flex: 1,
        width: 150,
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
})


const imageUploaderStyles=StyleSheet.create({
    container:{
        margin:15,
        elevation:2,
        height:150,
        width:150, 
        backgroundColor:'#efefef',
        position:'relative',
        borderRadius:999,
        overflow:'hidden',
        borderColor:"#0782F9",
        borderWidth:2
    },
    uploadBtnContainer:{
        opacity:0.7,
        position:'absolute',
        right:0,
        bottom:0,
        backgroundColor:'lightgrey',
        width:'100%',
        height:'25%',
    },
    uploadBtn:{
        display:'flex',
        alignItems:"center",
        justifyContent:'center'
    }
})

export {styles, imageUploaderStyles}