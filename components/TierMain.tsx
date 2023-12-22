"use client"
import React, { useMemo, useState } from 'react'
import { Column, Id, Card } from "@/app/types"
import { useSensors, useSensor, PointerSensor, 
        DndContext, DragStartEvent, DragEndEvent, DragOverEvent
} from "@dnd-kit/core"
import { arrayMove, SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable"
import { PlusCircle } from "lucide-react"
import { ColumnContainer } from "./ColumnContainer"


const defaultCols: Column[] = [
    {
        id: "S",
        title: "S",
        color: "#f44336",
    },
    {
        id: "A",
        title: "A",
        color: "#ff9800",
    },
    {
        id: "B",
        title: "B",
        color: "#ffeb3b",
    },
    {
        id: "C",
        title: "C",
        color: "#4caf50",
    },
    {
        id: "D",
        title: "D",
        color: "#80DBFF",
    },
    {
        id: "F",
        title: "F",
        color: "#D580FF",
    }
]

const defaultCard: Card[] = [
    {
        id: "1",
        columnId: "S",
        content: "July",
    },
    {
        id: "2",
        columnId: "S",
        content: "August",
    },
    {
        id: "3",
        columnId: "A",
        content: "June",
    },
    {
        id: "4",
        columnId: "A",
        content: "December",
    },
    {
        id: "5",
        columnId: "B",
        content: "March",
    },
    {
        id: "6",
        columnId: "B",
        content: "October",
    },
    {
        id: "7",
        columnId: "C",
        content: "May",
    },
    {
        id: "8",
        columnId: "C",
        content: "September",
    },
    {
        id: "9",
        columnId: "D",
        content: "April",
    },
    {
        id: "10",
        columnId: "D",
        content: "November",
    },
    {
        id: "11",
        columnId: "F",
        content: "January",
    },
    {
        id: "12",
        columnId: "F",
        content: "February",
    },
]

export const TierMain = () => {

    const [columns, setColumns] = useState<Column[]>(defaultCols)
    const [cards, setCards] = useState<Card[]>(defaultCard)
    const [editMode, setEditMode] = useState(false)
    const [mouseIsOver, setMouseIsOver] = useState(false)
    const [title, setTitle] = useState("Best Months of The Year! - Tier Maker")
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns])

    const [activeColumn, setActiveColumn] = useState<Column | null>(null)
    const [activeCard, setActiveCard] = useState<Card | null>(null)



    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    )

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column)
            return
        }
        if (event.active.data.current?.type === "Card") {
            setActiveColumn(event.active.data.current.task)
            return
        }
    }
    const onDragEnd = (event: DragEndEvent) => {
        setActiveColumn(null)
        setActiveCard(null)

        const { active, over } = event
        if (!over) return
        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return
        const isActiveAColumn = active.data.current?.type === "Column"
        if (!isActiveAColumn) return

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId)
            const overColumnIndex = columns.findIndex((col) => col.id === overId)
            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }
    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return
        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return
        const isActiveATask = active.data.current?.type === "Card"
        const isOverATask = over.data.current?.type === "Card"

        if (!isActiveATask) return
        if (isActiveATask && isOverATask) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((t) => t.id === activeId)
                const overIndex = cards.findIndex((t) => t.id === overId)

                if (cards[activeIndex].columnId != cards[overIndex].columnId) {
                    cards[activeIndex].columnId = cards[overIndex].columnId
                    return arrayMove(cards, activeIndex, overIndex - 1)
                }
                return arrayMove(cards, activeIndex, overIndex)
            })
        }
        const isOverAColumn = over.data.current?.type === "Column"
        if (isActiveATask && isOverAColumn) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((t) => t.id === activeId)
                cards[activeIndex].columnId = overId
                return arrayMove(cards, activeIndex, activeIndex)
            })
        }
    }
    const generateId = () => {
        return Math.floor(Math.random() * 10001)
    }
    const createColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
            color: "#09203f",
        }
        setColumns([...columns, columnToAdd])
    }
    const deleteColumn = (id: Id) => {
        const filteredColumns = columns.filter((col) => col.id !== id)
        setColumns(filteredColumns)
        const newCards = cards.filter((t) => t.columnId !== id)
        setCards(newCards)
    }
    const updateColumn = (id: Id, title: string) => {
        const newColumns = columns.map((col) => {
            if (col.id !== id) return col
            return {...col, title}
        })
        setColumns(newColumns)
    }
    const createCard = (columnId: Id) => {
        const newCard: Card = {
            id: generateId(),
            columnId,
            content: `Card ${cards.length + 1}`
        }
        setCards([...cards, newCard])
    }
    const deleteCard = (id: Id) => {
        const newCard = cards.filter((card) => card.id !== id)
        setCards(newCard)
    }
    const updateCard = (id: Id, content: string) => {
        const newCards = cards.map((card) => {
            if (card.id !== id) return card
            return {...card, content}
        })
        setCards(newCards)
    }
    const toggleEditMode = () => {
        setEditMode((prev) => !prev)
        setMouseIsOver(false)
    }


  return (
    <div className="flex min-h-screen w-full justify-center items-center p-8">
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            <div className="flex flex-col gap-2 w-[1200px]">
                { editMode 
                    ?
                    <input className="bg-black border rounded outline-none px-2 w-full text-xl"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => {
                            setEditMode(false)
                        }}
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return
                            setEditMode(false)
                        }}
                    />
                    :
                    <h1 className="text-xl" onClick={() => setEditMode(true)}>
                        {title}
                    </h1>
                }
                <button onClick={() => createColumn()}
                    className="flex h-[60px] w-full min-w-[330px] cursor-pointer 
                    rounded-lg p-4 ring-blue-500"
                >
                    <span className="w-6 h-6"><PlusCircle /></span>
                    Add Tier
                </button>
                <div className="flex flex-col gap-1">
                    <SortableContext items={columnsId} strategy={rectSwappingStrategy}>
                        {columns.map((col) => (
                            <ColumnContainer 
                                color={col.color}
                                key={col.id}
                                className=""
                                column={col}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createCard={createCard}
                                deleteCard={deleteCard}
                                updateCard={updateCard}
                                cards={cards.filter((card) => card.columnId === col.id)}
                            />
                            // <span>test</span>
                        ))}
                    </SortableContext>
                </div>
            </div>
        </DndContext>
    </div>
  )
}
