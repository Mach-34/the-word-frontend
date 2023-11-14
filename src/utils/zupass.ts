import { EmailPCDArgs, EmailPCDPackage } from '@pcd/email-pcd';
import { ArgsOf, ArgumentTypeName, PCDPackage } from '@pcd/pcd-types';
import { ActionPayload } from 'api';

const { REACT_APP_ZUPASS_URL: ZUPASS_URL } = process.env;

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


export const addPCD = ({ round, secret, username }: ActionPayload) => {
    // TODO: Provide replace any
    const proofUrl = constructZupassPcdProveAndAddRequestUrl<any>(
        ZUPASS_URL!,
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
    const popupUrl = `#/popup?proofUrl=${encodeURIComponent(proofUrl)}`;

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

    const popupUrl = `${window.location.origin}#/${popupRoute}`

    const proofUrl = constructZupassPcdGetRequestUrl<typeof EmailPCDPackage>(
        ZUPASS_URL!,
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
        ZUPASS_URL!,
        `${window.location.origin}#/popup`,
        EmailPCDPackage.name
    );
    sendZupassRequest(url);
};

/**
 * Converts a given word to array of 7 field elements
 * @dev split into 31-byte strings to fit in finite field and pad with 0's where necessary
 * @dev spotify allows maximum song length of 200 characters, so 7 field elements are used
 * @param title - the string entered by user to compute hash for (will be length checked)
 * @return - array of 7 bigints compatible with noir field element api
 */
export function convertTitleToFelts(title: string): Array<bigint> {
    // check length of title does not exceed spotify's requirements
    if (title.length > 180)
        throw Error('title too long: must be <= 200 characters');
    // convert to chunks of bytes
    let chunks: bigint[] = [];
    for (let i = 0; i < 6; i++) {
        const start = i * 31;
        const end = (i + 1) * 31;
        let chunk: Buffer;
        if (start >= title.length) {
            // if start is out of bounds, field element = 0
            chunk = Buffer.alloc(31);
        } else if (end > title.length) {
            // if end is out of bounds, pad front with 0's
            const partial = Buffer.from(title.slice(start), 'utf-8');
            chunk = Buffer.concat([partial, Buffer.alloc(31 - partial.length)]);
        } else {
            // chunk 31 bytes from the title string
            chunk = Buffer.from(title.slice(start, end), 'utf-8');
        }
        // pad an additional 0 to the front of the chunk
        chunk = Buffer.concat([Buffer.alloc(1), chunk]);
        // return as compatible hex string
        chunks.push(BigInt(`0x${chunk.toString('hex')}`) as bigint);
    }
    return chunks;
}

/**
 * Convers a utf-8 string (username) into a `bigint`
 * 
 * @param username - the string to convert to utf8 then decimal on bn254
 * @returns - the username as a `bigint` compatible with a single bn254 field element (Fr)
 */
export function usernameToBigint(username: string): bigint {
    if (username.length > 31)
        throw new Error('username too long: must be <= 31 characters');
    // encode utf8
    const encoder = new TextEncoder();
    const encoded = encoder.encode(username);
    // convert to bigint
    const hex = Buffer.from(encoded).toString('hex')
    return BigInt(`0x${hex}`) as bigint;
}

export const handlePopup = () => {
    let params;
    if (window.location.href.includes(window.location.origin + '/#/')) {
        const url = new URL(window.location.href.replace('#', ''));

        params = url.searchParams;
    } else {
        params = new URLSearchParams(window.location.search);
    }

    const paramsProofUrl = params.get('proofUrl');
    const paramsProof = params.get('proof');
    const paramsEncodingPendingPCD = params.get('encodedPendingPCD');
    const finished = params.get('finished');

    // First, this page is window.open()-ed. Redirect to Zupass.
    if (paramsProofUrl != null) {
        window.location.href = paramsProofUrl;
    } else if (finished) {
        // Later, Zupass redirects back with a result. Send it to our parent.
        if (paramsProof != null) {
            window.opener.postMessage({
                proof: paramsProof,
                zupass_redirect: true,
            });
        }
        window.close();
    } else if (paramsEncodingPendingPCD != null) {
        // Later, Zupass redirects back with a encodedPendingPCD. Send it to our parent.
        window.opener.postMessage({ proof: paramsProof, zupass_redirect: true });
        window.close();
    }
}
