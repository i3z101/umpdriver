import React, { Fragment, useState } from 'react'
import {View, Text, StyleSheet, KeyboardAvoidingView, Keyboard,ScrollView, TouchableWithoutFeedback, Dimensions} from 'react-native'
import {Formik} from 'formik'
import * as yup from 'yup'
import { Button, TextInput, Dialog} from 'react-native-paper'
import {FontAwesome} from '@expo/vector-icons'
import Color from '../../constants/Color'
import { Entypo } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux'
import { changeUserMode, driverAuthLogin, driverAuthRegister, hideError } from '../../store/authAction/authAction'
import {PulseIndicator} from 'react-native-indicators'

let authError;
let errorStatus;
let spinner;
const DriverAuth= props=>{
    const [signup, setSignup]= useState(false);
    const [gender, setGender]= useState(null);
    const [error, setError]= useState(false);
    const [tryAuth, setTryAuth]= useState(false);
    const validationSchema= yup.object({
        email:yup.string().required().email(),
        password:yup.string().required().min(7).max(15) ,
        fullName:signup? yup.string().required().min(5).max(20): yup.string().optional().min(5).max(20),
        phoneNumber:signup? yup.number().integer().min(10): yup.number().optional().positive().min(10).max(12)
    })
    authError= useSelector(state=>state.auth.authError)
    errorStatus= useSelector(state=>state.auth.errorStatus)
    const dispatch= useDispatch()

    const handleSubmitForm= (email, password, fullName, phoneNumber, gender)=>{
        if(signup){
            if(!gender){
                setError(true)
                return false;
            }
            setError(false)
            dispatch(driverAuthRegister(email,password,fullName,phoneNumber,gender))
        }else{
            setTryAuth(true)
            dispatch(driverAuthLogin(email, password))
            setTimeout(()=>{
                setTryAuth(false)
            },1000)
            
        }
    }

    if(tryAuth){
        spinner= <PulseIndicator color={'#4d4d4d'} size={55} style={styles.indicator}/>
    }
    else{
        spinner=null
    }

    return <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
    <View style={{flex:1,backgroundColor: tryAuth?'#747474':null}}>
    <KeyboardAvoidingView style={{...styles.container}} keyboardVerticalOffset={30} behavior={Platform.OS=='android'?'height':'padding'}>
    <Formik
    initialValues={{
        email:'',
        password:'',
        fullName:'',
        phoneNumber:'',
    }}
    onSubmit={(values)=>handleSubmitForm(values.email, values.password, values.fullName, values.phoneNumber, gender)}
    validationSchema={validationSchema}
    validateOnBlur={true}
    >
    {(formikProps)=>(
        <Fragment>
        <View style={{flexDirection:'row',justifyContent:'space-around'}}>
        <Text style={styles.title}>{signup?'Signup driver':'Signin driver'}</Text>
        <View>
        <Button mode='text' style={styles.buttonClick} color={Color.lightBlue} children='user?' onPress={()=>dispatch(changeUserMode())} disabled={tryAuth?true:false}/>
        </View>
        </View>
        
        <ScrollView keyboardShouldPersistTaps='handled'>
            <TextInput 
            mode='outlined'
            autoCapitalize='none'
            label='Email' 
            value={formikProps.values.email} 
            keyboardType='email-address' 
            onChangeText={(formikProps.handleChange('email'))} 
            style={styles.input}
            theme={{
                colors:{
                    primary:Color.lightBlue,
                    background:  tryAuth?'#747474':null,
                    accent:tryAuth?'#747474':null
                }
            }}
            disabled={tryAuth?true:false}
            />
            <Text style={styles.error}>{formikProps.touched.email&&formikProps.errors.email}</Text>

            <TextInput 
            mode='outlined' 
            label='passwword' 
            value={formikProps.values.password} 
            secureTextEntry 
            onChangeText={formikProps.handleChange('password')} 
            style={styles.input} 
            maxLength={15}
            theme={{
                colors:{
                    primary:Color.lightBlue,
                    background:  tryAuth?'#747474':null
                }
            }}
            disabled={tryAuth?true:false}
            />
            <Text style={styles.error}>{formikProps.touched.password&&formikProps.errors.password}</Text>

            {signup&&<Fragment>
                <TextInput 
                mode='outlined' 
                label='full name' 
                value={signup?formikProps.values.fullName:null}  
                onChangeText={signup&&formikProps.handleChange('fullName')} 
                style={styles.input} 
                maxLength={20}
                theme={{
                    colors:{
                        primary:Color.lightBlue,
                        background:  tryAuth?'#747474':null
                    }
                }}
                disabled={tryAuth?true:false}
                />
                <Text style={styles.error}>{formikProps.touched.fullName&&formikProps.errors.fullName}</Text>

                <TextInput 
                mode='outlined' 
                label='phone number' 
                value={signup?formikProps.values.phoneNumber:null} 
                keyboardType='phone-pad' 
                onChangeText={signup&&formikProps.handleChange('phoneNumber')} 
                style={styles.input} 
                maxLength={10}
                theme={{
                    colors:{
                        primary:Color.lightBlue,
                        background:  tryAuth?'#747474':null
                    }
                }}
                disabled={tryAuth?true:false}
                />
                <Text style={styles.error}>{formikProps.touched.phoneNumber&&formikProps.errors.phoneNumber}</Text>

                <View style={styles.radioConatiner}>
            <View style={{...styles.radioButtonContainer,backgroundColor:gender==='male'?Color.lightBlue:null, borderRadius:10,borderColor:error?'red':null, borderWidth:error?1:null}}>
            <FontAwesome name="male" size={24} color="black" style={{marginRight:'5%'}}/>
            <Text style={{fontSize:19, color:'black'}} onPress={tryAuth?()=>{}:()=>setGender('male')}>Male</Text>
            
            </View>
            <View style={{...styles.radioButtonContainer, backgroundColor:gender==='female'?'#ff3399':null, borderColor:error?'red':null, borderWidth:error?1:null}}>
            <FontAwesome name="female" size={24} color="black" style={{marginRight:'5%'}}/>
            <Text  style={{fontSize:19, color:'black'}} onPress={tryAuth?()=>{}:()=>setGender('female')}>Female</Text>
            </View>
            {error&&<Text style={{color:'red'}}>REQUIRED</Text>}
            </View>
                </Fragment>}
            <Button mode='contained' children={signup?'Signup': 'SignIn'} style={styles.button} color={Color.lightBlue} onPress={()=>{
                formikProps.handleSubmit()
            }}
            disabled={tryAuth?true:false}
            />
            <View style={signup?null:styles.haveNoAccountConatiner}>
            <Text style={styles.haveNoAccount}>{signup?"Switch to login?":"You don't have an account?"} </Text>
            <Button mode='text' style={styles.buttonClick} children='Click here' onPress={()=>setSignup(!signup)} disabled={tryAuth?true:false}/>
            </View>
            
        </ScrollView>
        {errorStatus&&<Dialog visible={errorStatus}>
        <Dialog.Title style={{textAlign:'center'}}>
            <Text style={{textAlign:'center', fontSize:16, fontWeight:'600'}}>{authError}</Text>
        </Dialog.Title>
        <Dialog.Content style={{width:'80%', alignSelf:'center'}}>
            <Button mode='contained' children="Okay" color={Color.Primary} onPress={()=>dispatch(hideError())}/>
        </Dialog.Content>
    </Dialog>}

        </Fragment>
    )}
    </Formik>
    {spinner}
    </KeyboardAvoidingView>
    </View>
    </TouchableWithoutFeedback>
    
}     
    


const styles= StyleSheet.create({
    container:{
        flex:1,
        marginVertical:'10%',
        justifyContent:'center',
    },
    title:{
        textAlign:'center',
        fontSize:20,
        fontWeight:'700',
        marginBottom:'8%',
        color:Color.lightBlue
    },
    input:{
        marginBottom:5,
        width:'88%',
        padding:'3%',
        alignSelf:'center'
    },
    button:{
        width:'70%',
        alignSelf:'center',
        padding:6,
        marginBottom:10,
        marginTop:15
    },
    radioButtonContainer:{
        flexDirection:'row', 
        justifyContent:'space-evenly', 
        alignItems:'center', 
        borderRadius:10, 
        padding:5
    },
    haveNoAccount:{
        textAlign:'center',
        fontSize:18,
        fontWeight:'400',
    },
    radioConatiner:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    buttonClicks:{
        width:'70%',
        alignSelf:'center',
        padding:6,
        marginBottom:10,
        marginTop:15
    },
    error:{
        color:'red',
        textAlign:'center'
    },
    indicator:{
        position:'absolute',
        top:'45%',
        right:'45%'
    }
})


export default DriverAuth