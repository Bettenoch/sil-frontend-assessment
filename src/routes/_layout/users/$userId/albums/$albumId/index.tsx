import { Container } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { UserAlbumsService } from '../../../../../../client'

export const Route = createFileRoute(
  '/_layout/users/$userId/albums/$albumId/',
)({
  component: AlbumInfo,
})
function getAlbumDetail({userId, albumId}:{userId:string, albumId: string}) {
    return {
        queryFn: () => UserAlbumsService.getAlbumId({ id: albumId, userId:userId}),
        queryKey: ["album", {albumId, userId}]
    }
}

function AlbumInfo() {
  return (
    <Container maxW={"full"}>


    </Container>
  )
}
