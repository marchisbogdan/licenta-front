import cookie from 'react-cookies'
import axios from 'axios'
import Config from 'Config'
import history from '../src/history'

export function createNewSession(authData, rememberMe){
	return new Promise((resolve,reject) => {
		cookie.save('jwtToken',authData.jwtToken,{path: '/'});
		//if(rememberMe){
			cookie.save('renewTokenId',authData.renewTokenId,{path: '/'});
			cookie.save('username',authData.subscriber.email,{path: '/'});
			cookie.save('role',authData.subscriber.role,{path:'/'});
		//}
		resolve();
	});
}

export function checkSessionExists(){
	if(!getSessionToken()){
		evictSession();
	}
}

export function ensureSessionExists(){
	return new Promise((resolve,reject)=>{
		if(getSessionToken()){
			resolve();
		}else{
			reject();
		}
	});
}

export function evictSession(){
	cookie.remove('jwtToken',{path:'/'});
	cookie.remove('renewTokenId',{path:'/'});
	cookie.remove('username',{path:'/'});
	cookie.remove('role',{path:'/'});

	// return to intro page
	history.push('/intro');
}

export function renewToken(){
	return new Promise((resolve,reject) =>{
		var username = cookie.load('username');
		var renewTokenId = cookie.load('renewTokenId');

		if(!renewTokenId){
			reject('There is no renewTokenId!');
		} else {
			let requestOption = {
				url: '/subscriber/renewToken',
				method: 'POST',
				baseURL: Config.subscriberUrl,
				headers:{
					'ContentType': 'application/json'
				},
				data: {
					emailOrUsername:username,
  					renewTokenId:renewTokenId
				}
			};

			axios(requestOption).then((response) => {
				console.log('Response of renewed token:'+JSON.stringify(response));
				if(response.data.success){
					cookie.save('jwtToken',response.data.data,{path:'/'});
					resolve();
				}else{
					console.log('Could not renew token!');
					reject();
				}
			}).catch((error) => {
				console.log("JTW RENEW REQUEST FAILED:"+JSON.stringify(error));
				evictSession();
				reject();
			});
		}
	});
}

export function handleLogout(){
  evictSession();
  history.push('/intro');
}

export function getSessionToken(){
  return cookie.load('jwtToken');
}