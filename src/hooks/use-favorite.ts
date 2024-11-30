import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-localstorage";
interface FavoriteCityItem {
    id: string;
    lat: number;
    lon: number;
    name: string;
    country: string;
    state?: string;
    addedAt: number;
}

export function useFavorite() {
    const [favorites, setFavorites] = useLocalStorage<FavoriteCityItem[]>("favorites", [])
    const queryClient = useQueryClient();

    const favoriteQuery = useQuery({
        queryKey: ["favorites"],
        queryFn: () => favorites,
        initialData: favorites,
        staleTime: Infinity
    })

    const addToFavorites = useMutation({
        mutationFn: async (
            city: Omit<FavoriteCityItem, "id" | "addedAt">
        ) => {
            const newFavoriteItem: FavoriteCityItem = {
                ...city,
                id: `${city.lat}-${city.lon}`,
                addedAt: Date.now()
            };

            const exists = favorites.some(
                (item) => item.id === newFavoriteItem.id
            )

            console.log(exists)
            if (exists) return favorites

            const newFavorites = [...favorites, newFavoriteItem].slice(0, 10)

            // const newFavorite = [newFavoriteItem, ...filteredHistory].slice(0, 10);

            setFavorites(newFavorites)
            return newFavorites
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"]
            })
        }
    })

    const removeFromFavorite = useMutation({
        mutationFn: async (cityId: string) => {
            const newFavorites = favorites.filter((favorite) => favorite.id !== cityId)

            setFavorites(newFavorites);
            return newFavorites
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"]
            })
        }
    });

    return {
        favorites: favoriteQuery.data,
        addToFavorites,
        removeFromFavorite,
        isFavorite: (lat: number, lon: number) => favorites.some((city) => city.lat === lat && city.lon === lon)
    }
}