export type ProfileType ={
    name : string
    designations : string[]
    socialMedias : SocialMediasType
}


type SocialMediaType ={
    title : string
    url : string
    iconUrl : string
}

type SocialMediasType = SocialMediaType[] 