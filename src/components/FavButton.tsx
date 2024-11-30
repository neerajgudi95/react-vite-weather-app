import { WeatherData } from "@/api/types"
import { useFavorite } from "@/hooks/use-favorite"
import { Button } from "./ui/button"
import { Heart } from "lucide-react"
import { toast } from "sonner"

interface FavButtonProps {
    data: WeatherData
}
const FavButton = ({ data }: FavButtonProps) => {
    const { addToFavorites, removeFromFavorite, isFavorite } = useFavorite()
    const isCurrentFavorite = isFavorite(data.coord.lat, data.coord.lon)
    console.log(isCurrentFavorite)
    const handleFavorite = () => {
        if (isCurrentFavorite) {
            removeFromFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`)
            toast.error(`Removed ${data.name} from favorites`)
        } else {
            addToFavorites.mutate({
                lat: data.coord.lat,
                lon: data.coord.lon,
                name: data.name,
                country: data.sys.country,
            });
            toast.success(`Added ${data.name} to favorites`)
        }
    }

    return (
        <div>
            <Button variant='ghost' onClick={handleFavorite}>
                <Heart
                    className={`${isCurrentFavorite ? 'text-red-500 hover:bg-red-600 fill-current' : ''}`} size={64} />
            </Button>
        </div>
    )
}

export default FavButton