import { CommandItem, CommandList } from "cmdk"
import { Button } from "./ui/button"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandSeparator } from "./ui/command"
import { useState } from "react"
import { Clock, Heart, Loader2, Search, XCircle } from "lucide-react"
import { useSearchLocation } from "@/hooks/use-weather"
import { useNavigate } from "react-router-dom"
import { useSeachHistory } from "@/hooks/use-search-history"
import { format } from "date-fns"
import { useFavorite } from "@/hooks/use-favorite"

const CitySearch = () => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const { data: locations, isLoading } = useSearchLocation(query)
    const { history, clearHistory, addToHistory } = useSeachHistory()
    const { favorites } = useFavorite()
    const navigate = useNavigate()

    const handleSelect = (cityData: string) => {
        const [lat, lon, name, country] = cityData.split("|")
        navigate(`city/${name}?lat=${lat}&lon=${lon}`)
        //Add to search history
        addToHistory.mutate({
            query,
            name,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            country,
        })
        setOpen(false)
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} variant={'outline'}
                className="w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64">
                <Search className="mr-2 h-4 w-4" />
                Search Cities
            </Button>
            <Command>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Search Cities..." value={query} onValueChange={setQuery} />
                    <CommandList>
                        {query.length > 2 && !isLoading && (<CommandEmpty>No Cities found.</CommandEmpty>)}
                        {favorites.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup heading='Favorites'>
                                    {
                                        favorites.map((location) => {
                                            return <CommandItem
                                                key={location.id}
                                                value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                                onSelect={handleSelect}
                                            >
                                                <div className="flex items-center justify-between gap-1">
                                                    <p className="flex items-center justify-end gap-2">
                                                        <Heart className="text-red-500 fill-current" />
                                                        <span>{location.name}</span>
                                                        {location.state && (
                                                            <span className="text-sm text-muted-foreground">
                                                                , {location.state}
                                                            </span>
                                                        )}
                                                        <span className="text-sm text-muted-foreground">
                                                            , {location.country}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{format(location.addedAt, "MMM d, h:mm a")}</p>
                                                </div>

                                            </CommandItem>
                                        })
                                    }
                                </CommandGroup>
                            </>
                        )}

                        {history.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <div className="flex items-center justify-between px-2 my-2">
                                        <p className="text-xs text-muted-foreground">Recent Searches</p>
                                        <Button variant="ghost" size="sm" onClick={() => clearHistory.mutate()}>
                                            <XCircle className="h-4 w-4" />Clear
                                        </Button>
                                    </div>
                                    {
                                        history.map((location) => {
                                            return <CommandItem
                                                key={location.id}
                                                value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                                onSelect={handleSelect}
                                            >
                                                <div className="flex items-center justify-between gap-1">
                                                    <p className="flex items-center justify-end">
                                                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <span>{location.name}</span>
                                                        {location.state && (
                                                            <span className="text-sm text-muted-foreground">
                                                                , {location.state}
                                                            </span>
                                                        )}
                                                        <span className="text-sm text-muted-foreground">
                                                            , {location.country}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{format(location.searchedAt, "MMM d, h:mm a")}</p>
                                                </div>

                                            </CommandItem>
                                        })
                                    }
                                </CommandGroup>
                            </>
                        )}

                        <CommandSeparator />
                        {locations && locations.length > 0 && (
                            <CommandGroup heading="Suggestions">
                                {
                                    isLoading && (
                                        <div className="flex items-center justify-center p-4">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )
                                }
                                {locations.map((location) => {
                                    return <CommandItem
                                        key={`${location.lat}-${location.lon}`}
                                        value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <p className="flex items-center gap-1">
                                            <Search className="mr-2 h-4 w-4" />
                                            <span>{location.name}</span>
                                            {location.state && (
                                                <span className="text-sm text-muted-foreground">
                                                    , {location.state}
                                                </span>
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                                , {location.country}
                                            </span>
                                        </p>

                                    </CommandItem>
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>
                </CommandDialog>
            </Command>
        </>
    )
}

export default CitySearch