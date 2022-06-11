import React,{Component} from 'react';
import { StyleSheet,View,TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../Colors';

class Inputs extends Component {
    state = {isFocused: false, hidePassword: true};

    onFocusChange = () => {
        // alert(event.target.value)
        // if(event.target.value == ''){
        //     this.setState({isFocused:!this.state.isFocused})
        //     // Alert.alert("empty",this.state.isFocused)
        // }
        // else if(this.state.isFocused == false)
        //     {
        //         this.setState({isFocused:!this.state.isFocused})
        //         // Alert.alert("false",this.state.isFocused)
        //     }
        this.setState({isFocused:!this.state.isFocused})

    }

    isPassword(){
       return (this.props.name.includes('Password') || this.props.name.includes('password'))
    }

    render() {
        return(
            <View style={[styles.container, this.props?.style,
                {borderColor:this.state.isFocused ? Colors.main : Colors.lightGrey}]}>
                <Input 
                    keyboardType={this.props.keyboardType}
                    dataDetectorTypes={this.props.type}
                    placeholder={this.props.name}
                    onFocus={this.onFocusChange}
                    onBlur = {this.onFocusChange}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputText}
                    secureTextEntry={ this.state.hidePassword && this.props.pass}
                    onChangeText={this.props.onChangeText}
                    value = {this.props.value}
                    onPressIn={this.props.onPress}
                    onEndEditing={this.props.onPressOut}
                    disabled={this.props.disabled}
                    accessible={this.props.accessible}
                    focusable={this.props.focusable}
                    keyboardAppearance={this.props.keyboardAppearance}
                    leftIcon={
                        <Icon 
                            name={this.props.icon}
                            size={22}
                            color={this.state.isFocused ? '#0779e4' : 'grey'}    
                        />
                    }
                    rightIcon={ this.isPassword() &&
                        <TouchableOpacity onPress={() => this.setState({hidePassword: !this.state.hidePassword})}>
                            <Icon 
                                name={ this.state.hidePassword ? "eye-slash" : "eye"}
                                size={22}
                                color={this.state.isFocused ? '#0779e4' : 'grey'}    
                            />
                        </TouchableOpacity>
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
