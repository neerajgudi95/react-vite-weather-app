import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-localstorage";
interface SearchHistoryItem {
    id: string;
    query: string;
    lat: number;
    lon: number;
    name: string;
    country: string;
    state?: string;
    searchedAt: number;
}

export function useSeachHistory() {
    const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>("search-history", [])
    const queryClient = useQueryClient();

    const historyQuery = useQuery({
        queryKey: ["search-history"],
        queryFn: () => history,
        initialData: history
    })

    const addToHistory = useMutation({
        mutationFn: async (
            search: Omit<SearchHistoryItem, "id" | "searchedAt">
        ) => {
            const now = Date.now()
            const newSearch: SearchHistoryItem = {
                ...search,
                id: `${search.lat}-${search.lon}-${now}`,
                searchedAt: now
            };

            const filteredHistory = history.filter(
                (item) => !(item.lat === search.lat && item.lon === search.lon)
            )

            const newHistrory = [newSearch, ...filteredHistory].slice(0, 10);

            setHistory(newHistrory)
            return newHistrory
        },
        onSuccess: (newHistory) => {
            queryClient.setQueryData(["search-history"], newHistory)
        }
    })

    const clearHistory = useMutation({
        mutationFn: async () => {
            setHistory([]);
            return []
        },
        onSuccess: () => {
            queryClient.setQueryData(["search-history"], [])
        }
    });

    return {
        history: historyQuery.data ?? [],
        addToHistory,
        clearHistory
    }
}