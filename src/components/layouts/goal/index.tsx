"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle, Trash2 } from "lucide-react";
import { differenceInDays, format, isBefore } from "date-fns";
import { GoalType } from "@/types/goal";
import { deleteGoal, getGoals } from "@/lib/api";
import { useEffect, useState } from "react";

async function handleDeleteGoal(id : number) {
  await deleteGoal(id)
  window.location.reload()
}


export default function Goal() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    getGoals().then((data) => {
      setGoals(data.goals);
    });
  }, []);

  const getDeadlineStatus = (deadline: Date | null) => {
    if (!deadline) return null;

    const today = new Date();
    const daysLeft = differenceInDays(deadline, today);

    if (isBefore(deadline, today)) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (daysLeft === 0) {
      return <Badge variant="default">Due today</Badge>;
    } else {
      return (
        <Badge variant="secondary">
          {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
        </Badge>
      );
    }
  };

  console.log(goals);
  return (
    <div className="flex items-center gap-4 p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Goal List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals ? (
              goals.map((goal: GoalType) => (
                <Card
                  key={goal.id}
                  className={goal.is_complet ? "bg-muted" : ""}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-grow">
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Label
                                htmlFor={`goal-${goal.id}`}
                                className={`text-xl font-semibold cursor-pointer hover:underline ${
                                  goal.is_complet
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {goal.title}
                              </Label>
                            </DialogTrigger>
                            <DialogContent className="max-w-ld max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{goal.title}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">
                                  Description:
                                </h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words overflow-y-auto max-h-[40vh]">
                                  {goal.description ||
                                    "No description provided."}
                                </p>
                              </div>
                              <Separator className="my-4" />
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>
                                  Registered:{format(goal.register_date, "PPP")}
                                </span>
                                {goal.deadline && (
                                  <div className="flex items-center space-x-2">
                                    <span>
                                      Deadline: {format(goal.deadline, "PPP")}
                                    </span>
                                    {getDeadlineStatus(goal.deadline)}
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant={
                                goal.is_complet ? "secondary" : "default"
                              }
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {goal.is_complet ? "Completed" : "Complete"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to mark this goal as
                                {goal.is_complet ? " incomplete" : " complete"}?
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction>
                                {goal.is_complet
                                  ? "Mark as incomplete"
                                  : "Mark as complete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteGoal(goal.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        Registered: {format(goal.register_date, "PPP")}
                      </span>
                      {goal.deadline && (
                        <div className="flex items-center space-x-2">
                          <span>Deadline: {format(goal.deadline, "PPP")}</span>
                          {getDeadlineStatus(goal.deadline)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No goals found.</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {goals ? goals.length : 0} goal
            {(goals ? goals.length : 0) !== 1 ? "s" : ""}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
