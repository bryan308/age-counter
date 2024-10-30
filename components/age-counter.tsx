"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { differenceInMilliseconds, setYear } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Input } from "./ui/input"

const lerp = (start: number, end: number, alpha: number) => start * (1 - alpha) + end * alpha

export function AgeCounterComponent() {
	const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
	const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined)
	const [birthTime, setBirthTime] = useState<string | null>(null)
	const [displayAge, setDisplayAge] = useState(0)
	const [showCounter, setShowCounter] = useState(false)
	const animationRef = useRef<number>()
	const lastUpdateTimeRef = useRef<number>(0)
	const targetAgeRef = useRef<number>(0)

	const currentYear = new Date().getFullYear()

	useEffect(() => {
		if (birthDate && showCounter) {
			const updateAge = (currentTime: number) => {
				if (lastUpdateTimeRef.current === 0) {
					lastUpdateTimeRef.current = currentTime
				}

				const deltaTime = currentTime - lastUpdateTimeRef.current
				lastUpdateTimeRef.current = currentTime

				const ageInMs = differenceInMilliseconds(new Date(), birthDate)
				targetAgeRef.current = ageInMs / (365.25 * 24 * 60 * 60 * 1000)

				setDisplayAge((prevAge) => lerp(prevAge, targetAgeRef.current, deltaTime * 0.005))

				animationRef.current = requestAnimationFrame(updateAge)
			}

			animationRef.current = requestAnimationFrame(updateAge)

			return () => {
				if (animationRef.current) {
					cancelAnimationFrame(animationRef.current)
				}
			}
		}
	}, [birthDate, showCounter])

	const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const yearNumber = parseInt(e.target.value, 10)
		if (!isNaN(yearNumber) && yearNumber > 0 && yearNumber <= currentYear) {
			setSelectedYear(yearNumber)
			if (birthDate) {
				setBirthDate(setYear(birthDate, yearNumber))
			} else {
				setBirthDate(setYear(new Date(), yearNumber))
			}
		} else {
			setSelectedYear(undefined)
		}
	}

	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			setBirthDate(selectedYear ? setYear(date, selectedYear) : date)
		} else {
			setBirthDate(undefined)
		}
	}

	const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setBirthTime(event.target.value)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (birthDate) {
			if (birthTime) {
				const [hours, minutes] = birthTime.split(":").map(Number)
				birthDate.setHours(hours, minutes)
			}
			setShowCounter(true)
			lastUpdateTimeRef.current = 0
		}
	}

	const handleReset = () => {
		const currentYear = new Date().getFullYear()
		setShowCounter(false)
		setBirthDate(setYear(new Date(), currentYear))
		setSelectedYear(currentYear)
		setBirthTime(null)
		setDisplayAge(0)
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current)
		}
		lastUpdateTimeRef.current = 0
	}

	const handleInputReset = () => {
		setSelectedYear(undefined)
		setBirthDate(undefined)
		setBirthTime(null)
	}

	return (
		<Card className="w-full max-w-md mx-auto mt-20 border-none shadow-none">
			<CardContent className="p-6">
				<div
					className={`transition-opacity duration-500 ${
						showCounter ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
					}`}
				>
					<form
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="birthdate">Birth date:</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										id="birthdate"
										variant={"outline"}
										className={cn(
											"w-full justify-start text-left font-normal",
											!birthDate && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{birthDate ? format(birthDate, "MMMM d, yyyy") : <span>Pick a date</span>}
										<ChevronDown className="ml-auto h-4 w-4 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0"
									align="start"
								>
									<Calendar
										mode="single"
										selected={birthDate}
										onSelect={handleDateSelect}
										initialFocus
										defaultMonth={birthDate || new Date()}
									/>
								</PopoverContent>
							</Popover>
						</div>
						<div className="space-y-2">
							<Label htmlFor="birthyear">Birth year:</Label>
							<Input
								type="number"
								id="birthyear"
								className="w-full p-2 border rounded"
								value={selectedYear || ""}
								onChange={handleYearChange}
								placeholder="YYYY"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="birthtime">Birth time (optional):</Label>
							<Input
								type="time"
								id="birthtime"
								className="w-full p-2 border rounded"
								value={birthTime || ""}
								onChange={handleTimeChange}
								placeholder="HH:MM"
							/>
						</div>
						<div className="flex space-x-4">
							<Button
								type="submit"
								disabled={!birthDate}
							>
								Show Age
							</Button>
							<Button
								variant="destructive"
								type="button"
								onClick={handleInputReset}
							>
								Reset
							</Button>
						</div>
					</form>
				</div>
				<div
					className={`text-center transition-opacity duration-500 ${
						showCounter ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
					}`}
				>
					<p className="text-base">Age</p>
					<p className="text-4xl font-mono transition-all duration-500 ease-in-out">
						{displayAge.toFixed(10)}
					</p>
					<Button
						onClick={handleReset}
						className="mt-4"
					>
						Reset
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
