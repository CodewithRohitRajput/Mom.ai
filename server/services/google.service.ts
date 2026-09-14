import {google} from 'googleapis'

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI} = process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error(
        'Missing Google OAuth configuration. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.'
    )
}

const oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
)


export const getGoogleUser = async (accessToken: string) => {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo',{
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        throw new Error(`Google user info request failed: ${response.status}`)
    }

    const data = await response.json() as {
        id?: string
        name?: string
        email?: string
        picture?: string
    }

    if (!data.id || !data.email) {
        throw new Error("Google user info is missing id or email")
    }

    return data
}



export const getGoogleAuthUrl = () => {
    return oauth2client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope:[
            "openid",
            "email",
            "profile",
              "https://www.googleapis.com/auth/documents",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/meetings.space.readonly"
        ]
    })
}

export const getGoogleTokens = async (code:string) => {
    const {tokens} = await oauth2client.getToken(code)
    return tokens
}

export const refreshAccessToken = async (refreshToken: string) => {
    const client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI
    )

    client.setCredentials({ refresh_token: refreshToken })

    const { token } = await client.getAccessToken()

    if (!token) {
        throw new Error("Failed to refresh Google access token")
    }

    return token
}


export const createGoogleDoc = async (accessToken: string, title: string, content: string)=>{
    oauth2client.setCredentials({
        access_token: accessToken
    })

    const docs = google.docs({
        version: "v1",
        auth: oauth2client
    })

    const document = await docs.documents.create({
        requestBody: {
            title
        }
    })

    const documentId = document.data.documentId

    await docs.documents.batchUpdate({
        documentId: documentId!,
        requestBody: {
            requests: [{
                insertText: {
                    location: {
                        index: 1
                    },
                    text: content
                }
            }]
        }
    })

    return documentId
    

}





