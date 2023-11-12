import { EmailPCDArgs, EmailPCDPackage } from '@pcd/email-pcd';
import { ArgsOf, ArgumentTypeName, PCDPackage } from '@pcd/pcd-types';
import { ShoutWhisperPayload } from 'api';
import { ZUPASS_URL } from 'utils/constants';

enum PCDRequestType {
    Get = "Get",
    GetWithoutProving = "GetWithoutProving",
    Add = "Add",
    ProveAndAdd = "ProveAndAdd"
}

export interface PCDGetWithoutProvingRequest extends PCDRequest {
    pcdType: string;
}

export interface PCDGetRequest<T extends PCDPackage = PCDPackage> extends PCDRequest {
    type: PCDRequestType.Get
    pcdType: T["name"]
    args: ArgsOf<T>
    options?: ProveOptions
}

interface PCDRequest {
    returnUrl: string;
    type: PCDRequestType;
}

interface ProveOptions {
    genericProveScreen?: boolean;
    title?: string;
    description?: string;
    debug?: boolean;
    proveOnServer?: boolean;
    signIn?: boolean;
}

interface PCDProveAndAddRequest<T extends PCDPackage = PCDPackage>
    extends PCDRequest {
    type: PCDRequestType.ProveAndAdd;
    pcdType: string;
    args: ArgsOf<T>;
    options?: ProveOptions;
    returnPCD?: boolean;
}


export const addPCD = ({ round, secret, username }: ShoutWhisperPayload) => {
    // TODO: Provide replace any
    const proofUrl = constructZupassPcdProveAndAddRequestUrl<any>(
        ZUPASS_URL,
        window.location.origin + '#/popup',
        'secret-phrase-pcd',
        {
            includeSecret: {
                argumentType: ArgumentTypeName.Boolean,
                description: 'Set true to store secrets in zupass upon initial PCD creation',
                userProvided: false,
                value: true,
            },
            phraseId: {
                argumentType: ArgumentTypeName.Number,
                description: 'The Round ID identifying the secret phrase',
                userProvided: false,
                value: round,
            },
            secret: {
                argumentType: ArgumentTypeName.String,
                defaultVisible: false,
                userProvided: false,
                description: 'The secret phrase to prove knowledge of',
                value: secret,
            },
            username: {
                argumentType: ArgumentTypeName.String,
                description: 'The username associated with this secret phrase proof',
                userProvided: false,
                value: username,
            },
        },
        { title: 'Secret Phrase Proof' }
    );
    sendZupassRequest(proofUrl);
}

export function constructZupassPcdGetRequestUrl<T extends PCDPackage>(
    zupassClientUrl: string,
    returnUrl: string,
    pcdType: T["name"],
    args: ArgsOf<T>,
    options?: ProveOptions
) {
    const req: PCDGetRequest<T> = {
        type: PCDRequestType.Get,
        returnUrl: returnUrl,
        args: args,
        pcdType,
        options
    }
    const encReq = encodeURIComponent(JSON.stringify(req))
    return `${zupassClientUrl}#/prove?request=${encReq}`
}

const constructZupassPcdProveAndAddRequestUrl = <
    T extends PCDPackage = PCDPackage
>(
    zupassClientUrl: string,
    returnUrl: string,
    pcdType: string,
    args: ArgsOf<T>,
    options?: ProveOptions,
    returnPCD?: boolean
) => {
    const req: PCDProveAndAddRequest = {
        type: PCDRequestType.ProveAndAdd,
        returnUrl: returnUrl,
        pcdType,
        args,
        options,
        returnPCD
    };
    const eqReq = encodeURIComponent(JSON.stringify(req));
    return `${zupassClientUrl}#/add?request=${eqReq}`;
}

export const sendZupassRequest = (proofUrl: string) => {
    const popupUrl = `http://localhost:3001/#/popup?proofUrl=${encodeURIComponent(proofUrl)}`;

    window.open(popupUrl, "_blank", "width=450,height=600,top=100,popup");
}

export function openEmailPCDPopup(
    popupRoute: string = "popup"
) {
    const args: EmailPCDArgs = {
        privateKey: {
            argumentType: ArgumentTypeName.String,
            value: undefined,
            userProvided: false
        },
        emailAddress: {
            argumentType: ArgumentTypeName.String,
            value: undefined,
            userProvided: true
        },
        semaphoreId: {
            argumentType: ArgumentTypeName.String,
            value: undefined,
            userProvided: false
        },
        id: {
            argumentType: ArgumentTypeName.String,
            value: undefined,
            userProvided: true
        },
    }

    const popupUrl = `http://localhost:3001/#/${popupRoute}`

    const proofUrl = constructZupassPcdGetRequestUrl<typeof EmailPCDPackage>(
        ZUPASS_URL,
        popupUrl,
        EmailPCDPackage.name,
        args,
        {
            genericProveScreen: true,
            title: "Email Proof",
            description: "Email PCD Request"
        }
    )
    openZupassPopup(popupUrl, proofUrl);
}

const openZupassPopup = (popupUrl: string, proofUrl: string) => {
    const url = `${popupUrl}?proofUrl=${encodeURIComponent(proofUrl)}`

    window.open(url, "_blank", "width=450,height=600,top=100,popup")
}

export function getWithoutProvingUrl(
    zupassClientUrl: string,
    returnUrl: string,
    pcdType: string
) {
    const req: PCDGetWithoutProvingRequest = {
        type: PCDRequestType.GetWithoutProving,
        pcdType,
        returnUrl
    };
    const encReq = encodeURIComponent(JSON.stringify(req));
    return `${zupassClientUrl}#/get-without-proving?request=${encReq}`;
}

export const getProofWithoutProving = () => {
    const url = getWithoutProvingUrl(
        ZUPASS_URL,
        window.location.origin + '#/popup',
        EmailPCDPackage.name
    );
    sendZupassRequest(url);
};
