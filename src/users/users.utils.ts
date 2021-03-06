import * as jwt from "jsonwebtoken";
import client from "../client";
import {Resolver} from "../types";

export const getUser = async (token) => {
	try {
		const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY);
		
		if (!verifiedToken.id) {
			return {
				ok: false,
				error: "inValid token"
			}
		}
		const user = await client.user.findUnique({where: {id: verifiedToken.id}});
		return user ? user : null;
	} catch (e) {
		return null;
	}
}
// 1. 함수를 선언하자마자 실행된다, 그 다음 client(browser) 가 실행시키지 않는 이상 실행되지 않는다
export const protectResolver = (ourResolver: Resolver) => (root,args, context, info ) => {
	
	if (!context.loggedInUser) {
		if (info.operation.operation === 'query'){
			return null;
		}
		
		return {
			ok: false,
			error: "log in please"
		}
	} // 단순 콜백함수라 생각함
	return ourResolver(root, args, context, info)
}
