import { StyleSheet } from 'react-native'
import { Directions } from 'react-native-gesture-handler'
import { Colors } from './Colors'

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
        padding: 10,
        borderRadius: 100,
        alignItems: 'center',
        marginVertical: 25
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
    dateInputButton:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection:'row',
        borderWidth:3.5,
        width:'90%',
        borderRadius:100,
        borderColor:'#eee',
        marginVertical:10,
    }
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

const docImageUploaderStyles=StyleSheet.create({
    container:{
        elevation:2,
        height:150,
        width:150, 
        backgroundColor:'#efefef',
        position:'relative',
        overflow:'hidden',
        borderColor:"#0782F9",
        borderWidth:1,

        borderRadius: 12,
        overflow: "hidden",
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
    },
    removeBtnContainer:{
        position:'absolute',
        left:0,
        top:0,
    },
    removeBtn:{
        display:'flex',
        alignItems:"flex-start",
        margin: 5,
        justifyContent:'center'
    },

    mediaImageContainer: {
        width: 180,
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
    },

})

const modelContent = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 1,
        marginTop:495,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalRowView: {
        flexDirection: "row",
        alignItems: "center",
        marginTop:10,
        height:"100%"
    },
    button: {
        backgroundColor:'#0782F9',
        borderWidth:5,
        borderColor:Colors.main,
        alignItems:'center',
        justifyContent:'center',
        width:70,
        height:70,
        marginRight:15,
        marginBottom:350,
        top:10,
        margin:10,
        marginHorizontal:15,
        backgroundColor:'#fff',
        borderRadius:50,
    },
    chooseButton: {
        backgroundColor:'#0782F9',
        borderWidth:5,
        borderColor:Colors.main,
        alignItems:'center',
        justifyContent:'center',
        width:70,
        height:70,
        marginRight:15,
        marginBottom:350,
        top:20,
        margin:10,
        marginHorizontal:15,
        backgroundColor:'#fff',
        borderRadius:50,
    },
});

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
        borderTopWidth: 1,
        width:'88%'
    },
    textWithButDivider:{
        fontFamily: "HelveticaNeue",
        color: "#52575D",
        borderBottomColor: 'lightgrey', 
        borderBottomWidth: 1,
    },
    textWithTopDivider:{
        fontFamily: "HelveticaNeue",
        color: "#52575D",
        borderTopColor: 'lightgrey', 
        borderTopWidth: 1,
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined,
        borderRadius:100,
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
        fontWeight: "500",
    },
    profileHouseImage: {
        marginTop: 25,
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden",
        
    },
    dm: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 40,
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
    haveNewMessages:{
        backgroundColor: "#F04228",
        position: "absolute",
        bottom: 16,
        left: -15,
        padding: 4,
        height: 13,
        width: 13,
        borderRadius: 10,
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
        borderColor:"#0782F9",
        elevation: 5,

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
        fontSize: 12,
        marginLeft: 40
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
    },
    typeIcone: {
        backgroundColor:'#0782F9',
        borderWidth:2,
        borderColor:'lightgrey',
        alignItems:'center',
        justifyContent:'center',
        width:25,
        height:25,
        right:0,
        backgroundColor:'#fff',
        borderRadius:50,
    },
    subTextIcon: {
        fontSize: 11,
        color: "#AEB5BC",
        fontWeight: "500",
    },
});
const TodoSheet = StyleSheet.create({
      body :{
        margin: 0,
        padding: 0,
        // fontfamily: sansserif,
        color: "white",
      },
      App :{
        // fontfamily: sansserif,
        textAlign: "center",
      },
      
      appbackground: {
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 100,
      },
      
      maincontainer: {
        backgroundColor: "#ffd966",
        width: 350,
        // height: "min-content",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#FF000023",
        shadowOffset: {hight:10,with:10},
        shadowOpacity: 0
      }
      ,
      title :{
        textAlign: "center",
      },
      
      additembox: {
        backgroundColor: "#CABFAB",
        color: "#ec645b",
        marginTop: 1,
        marginBottom: 1,
        display: "flex",
        alignItems: "center",
        borderRadius: 10,
        padding: 0,
        flexDirection:"row",

      },

      additeminput :{
        // boxsizing: "border-box",
        // border: "none",
        backgroundColor: "transparent",
        color: "#595651",
        width: "80%",
        height: 30,
        marginRight: 25,
      },
      
    //   input:placeholder {
    //     color: "#ec645b",
    //   }
    //   input:focus {
    //     outline: 0,
    //   }
      
      itemlist: {
        display: "flex",
        flexDirection: "column",
      },
      
      itemcontainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // padding: "20px 0 20px 0",
        // borderbottom: "1px #fbc1bb solid",
        flexDirection:"row",
        borderBottomColor:"#CABFAB",
        borderBottomWidth:1,
    
      },
      
      itemname: {
        marginVertical:7
      },
      
      
      itemactionbuttons: {
        width: "30%", 
        display: "flex",
        justifyContent: "space-between",
      },
      
      removebutton: {
        color: "white",
        backgroundColor: "red",
      },
      
      total: {
        // float: "right",
        padding: 10,
      },
      
      quantity: {
        display: "flex",
        alignItems: "center",
        borderWidth: 1,
        backgroundColor: "white",
        borderRadius: 50,
        fontSize: 12,
        color: "#ec645b",
        minWidth: 70,
        justifyContent: "space-between",
        flexDirection:"row"
      },
      trash: {
        display: "flex",
        alignItems: "center",
        fontSize: 12,
        justifyContent: "space-between",
        flexDirection:"row",
        marginTop:15
      },
      button: {
        backgroundColor: "transparent",
        // border: "none",
        margin: 3,
        color: "#ec645b",
      },
    //   button:focus {
    //     outline: 0,
    //   }
      
    //   button:hover {
    //     cursor: pointer,
    //   }
      
      completed: {
        textDecorationLine: 'line-through', 
        textDecorationStyle: 'solid',
        marginHorizontal:7,
        maxWidth:'70%'
      }
})
export {styles, imageUploaderStyles,docImageUploaderStyles, houseProfileStyles, TodoSheet, modelContent}