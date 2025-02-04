import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { rawCourses } from "@/data/courses";
import { gradesAtom } from "@/store/grades";
import { planningAtom } from "@/store/planning";
import { exportAtom, startingSemesterAtom } from "@/store/settings";
import { SemesterType } from "@/types/courses";
import { useAtom } from "jotai";
import { FileUp } from "lucide-react";
import { toast } from "sonner";

export default function SettingsScreen() {
	const [exportData, importData] = useAtom(exportAtom);

	const [, setPlanning] = useAtom(planningAtom);
	const [, setGrading] = useAtom(gradesAtom);

	const exportFile = () => {
		const data = JSON.stringify(exportData);
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "StudyPlanner.json";
		a.click();
		URL.revokeObjectURL(url);
	};

	const importFile = (file: File | null | undefined) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = e.target?.result as string;
			importData(data);
		};
		reader.readAsText(file);
	};

	const resetPlanning = () => {
		setPlanning([]);
		toast.success("Successfully reset course planning");
	};

	const resetGrading = () => {
		setGrading([]);
		toast.success("Successfully reset grading");
	};

	const resetToRecommended = () => {
		setPlanning(rawCourses.map((c) => ({ name: c.name, plannedSemester: c.recommendedSemester! })));
		setStartingSemester({ year: new Date().getFullYear(), type: "WS" });
		toast.success("Successfully reset to recommended study plan");
	};

	const [startingSemester, setStartingSemester] = useAtom(startingSemesterAtom);

	return (
		<section className="h-full grid gap-4 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 grid-rows-4">
			<Card className="">
				<CardHeader>
					<CardTitle>Starting Semester</CardTitle>
					<CardDescription>
						Specify when you started studying. This will correctly count your first, second etc. semester.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="year">Year</Label>
								<Input
									id="year"
									placeholder={new Date().getFullYear().toString()}
									type="number"
									min="1900"
									max="2099"
									step={"1"}
									value={startingSemester.year}
									onChange={(e) => setStartingSemester({ ...startingSemester, year: parseInt(e.target.value) })}
								/>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="semester">Semester</Label>
								<ToggleGroup
									type="single"
									id={"semester"}
									value={startingSemester.type}
									onValueChange={(value) => setStartingSemester({ ...startingSemester, type: value as SemesterType })}>
									<ToggleGroupItem value="WS" aria-label="Toggle WS">
										<h2>WS</h2>
									</ToggleGroupItem>
									<ToggleGroupItem value="SS" aria-label="Toggle SS">
										<h2>SS</h2>
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
			<Card className="">
				<CardHeader>
					<CardTitle>Import/Export</CardTitle>
					<CardDescription>Import, Export and share your data.</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<Input type="file" onChange={(e) => importFile(e.target.files?.item(0))} accept=".json" />
					<Button onClick={exportFile}>
						<FileUp /> Export
					</Button>
				</CardContent>
			</Card>
			<Card className="">
				<CardHeader>
					<CardTitle>Reset</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<Button onClick={resetPlanning} variant={"destructive"}>
						Reset course planning
					</Button>
					<Button onClick={resetGrading} variant={"destructive"}>
						Reset grading
					</Button>
					<Button onClick={resetToRecommended} variant={"destructive"}>
						Reset to recommended study plan
					</Button>
				</CardContent>
			</Card>
		</section>
	);
}
