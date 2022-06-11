import React from 'react'
import { View, KeyboardAvoidingView } from 'react-native'
import Input from '../components/Inputs';
import { ListItem, Avatar } from 'react-native-elements';
import { styles } from '../styleSheet'


const SearchBar = (props) => {
    return (
        <KeyboardAvoidingView>
            <View style={props.style}>
                <Input name={props.name}  icon = "search" onChangeText={props.onChangeText} />
            </View>
            <View>
            {props.list &&
                    props.list
                    .slice(0, props.slice)
                        .map((l, i) => 
                        (
                            <ListItem key={i} bottomDivider={props.bottomDivider} topDivider={props.topDivider} Component={props.Component}
                            friction={90} //
                            tension={100} // These props are passed to the parent component (here TouchableScale)
                            activeScale={0.95}
                            onPress={props.listItemOnPress}
                            >
                                <ListItem.Content>
                                <ListItem.Title style={styles.listTextItem} >{l.fName + " " + l.lName}</ListItem.Title>
                                <ListItem.Subtitle style={styles.listSubtitleTextItem}>{l.email}</ListItem.Subtitle>
                                </ListItem.Content>
                                <Avatar source={{uri: l.uImage}} rounded/>
                            </ListItem>
                        ))
                    }
            </View>
        </KeyboardAvoidingView>
    )
}

export default SearchBar
