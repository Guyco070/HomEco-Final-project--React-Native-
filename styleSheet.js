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
        width: '50%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
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
        //fontFamily: 'HeleveticaNeue',
        fontSize: 18,
        alignSelf: 'center',
        margin: 10
    },
    textBody:{
        //fontFamily: 'HeleveticaNeue',
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
        //fontFamily: 'HeleveticaNeue',
        fontSize: 16,
        alignSelf: "flex-end",
    },
    listSubtitleTextItem:{
        //fontFamily: 'HeleveticaNeue',
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



const houseProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },
    textWithTopAndButDividers:{
        fontFamily: "HelveticaNeue",
        color: "#52575D",
        borderBottomColor: 'lightgrey', 
        borderTopColor: 'lightgrey', 
        borderBottomWidth: 1,
        borderTopWidth: 1
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginHorizontal: 16
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    profileHouseImage: {
        marginTop: 25,
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden"
    },
    dm: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    active: {
        backgroundColor: "#34FFB9",
        position: "absolute",
        bottom: 28,
        left: 15,
        padding: 4,
        height: 20,
        width: 20,
        borderRadius: 10
    },
    userProfileImage: {
        backgroundColor: "lightgrey",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        borderWidth: 2,
        borderColor:"#0782F9"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    mediaImageContainer: {
        width: 180,
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginHorizontal: 10
    },
    mediaCount: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: "50%",
        marginTop: -50,
        marginLeft: 30,
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        shadowColor: "rgba(0, 0, 0, 0.38)",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        shadowOpacity: 1
    },
    recent: {
        marginLeft: 78,
        marginTop: 32,
        marginBottom: 6,
        fontSize: 10
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16
    },
    activityIndicator: {
        backgroundColor: "#CABFAB",
        padding: 4,
        height: 12,
        width: 12,
        borderRadius: 6,
        marginTop: 3,
        marginRight: 20
    }
});

export {styles, imageUploaderStyles, houseProfileStyles}