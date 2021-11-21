import React,{Component} from 'react';
import { StyleSheet,View,TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

class Inputs extends Component {
    state = {isFocused: false};

    onFocusChange = () => {
        if(event.target.value == '' )
            this.setState({isFocused:!this.state.isFocused})
        else if(this.state.isFocused == false)
            this.setState({isFocused:!this.state.isFocused})
    }

    render() {
        return(
            <View style={[styles.container,{borderColor:this.state.isFocused ? 
            '#0779ef' : '#eee'}]}>
                <Input 
                    keyboardType={this.props.keyboardType}
                    dataDetectorTypes={this.props.type}
                    placeholder={this.props.name}
                    onFocus={this.onFocusChange}
                    onBlur = {this.onFocusChange}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputText}
                    secureTextEntry={this.props.pass}
                    onChangeText={this.props.onChangeText}
                    value = {this.props.value}
                    leftIcon={
                        <Icon 
                            name={this.props.icon}
                            size={22}
                            color={this.state.isFocused ? '#0779e4' : 'grey'}    
                        />
                    }
                />
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        width:'90%' ,
        height: 50,
        borderRadius: 100,
        marginVertical:10,
        borderWidth:3.5
    },
    inputContainer: {
        borderBottomWidth:0
    },
    inputText: {
        //color: '#0779e4',
        fontWeight: 'bold',
        marginLeft:5
    }

});

export default Inputs;
