import { Card, Column, Id } from "@/app/types"
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { PlusIcon, Settings, TrashIcon } from "lucide-react"
import { DragCard } from "./DragCard"


interface Props {
    column: Column
    deleteColumn: (id: Id) => void
    updateColumn: (id: Id, title:string) => void
    createCard: (columnId: Id) => void
    updateCard: (id: Id, title:string) => void
    deleteCard: (id: Id) => void
    cards: Card[]
    color: string
    className: string
}

export const ColumnContainer = ({
    column, deleteColumn, updateColumn, createCard, cards, color,
    deleteCard, updateCard, className
}: Props) => {
    const [editMode, setEditMode] = useState(false)
    const [background, setBackground] = useState(color)
    const solid = [
        "#f44336", //red
        "#ff9800", //orange
        "#ffc107", //amber
        "#ffeb3b", //yellow
        "#cddc39", //lime
        "#4caf50", //green
        "#00bcd4", //cyan
        "#09203f", //background    
    ]
    const divRef = useRef<HTMLDivElement | null>(null)
    const textRef = useRef<HTMLDivElement | null>(null)
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const cardsIds = useMemo(() => {
        return cards.map((card) => card.id)
    }, [cards])

    useEffect(() => {
        const bgColor: string[] | undefined = divRef.current?.style.backgroundColor.replace(/[()rgba ]/g, "").split(",")
        if (!bgColor) return
        const luminance: number = (0.2126 * parseInt(bgColor[0], 16)) + (0.7152 * parseInt(bgColor[1], 16)) + (0.0722 * parseInt(bgColor[2], 16))
 
        if (luminance > 128) {
            // light background
            if (textRef.current) {
                textRef.current.className = "break-all text-black"
            }
        } else {
            // dark background
            if (textRef.current) {
                textRef.current.className = "break-all text-white"
            }
        }
    }, [background])



  if (isDragging) {
    return (
        <div ref={setNodeRef} style={style} 
            className="opacity-40 border-2 border-blue-500 w-full min-w-[330px]
            min-h-[100px] rounded-md flex flex-row"></div>
    )
  }
  return (
    <div ref={setNodeRef} style={style}
        className="w-full min-w-[330px] h-full min-h-[100px] rounded-md flex items-stretch justify-between"
    >
        {/* title */}
        <div ref={divRef} {...attributes} {...listeners}
            onClick={() => {
                setEditMode(true)
            }}
            className="flex justify-center items-center text-sm rounded-md w-24"
            style={{ background }}
        >
            <div className="flex gap-2 justify-center items-center text-sm rounded-full w-24">
                <div className="flex p-2">
                    <p ref={textRef} className="break-all text-black">
                        {!editMode && column.title}
                    </p>
                    {editMode && (
                        <input
                            className="bg-black border rounded outline-none px-2 w-full"
                            value={column.title}
                            onChange={(e) => updateColumn(column.id, e.target.value)}
                            autoFocus
                            onBlur={() => {
                                setEditMode(false)
                            }}
                            onKeyDown={(e) => {
                                if(e.key !== "Enter") return
                                setEditMode(false)
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
        {/* content */}
        <div className="flex flex-grow gap-2 p-2">
            <div className="flex flex-wrap w-full gap-4 justify-start">
                <SortableContext items={cardsIds} strategy={horizontalListSortingStrategy}>
                    {cards.map((card) => (
                        <DragCard
                            key={card.id}
                            card={card}
                            deleteCard={deleteCard}
                            updateCard={updateCard}
                        />
                    ))}
                </SortableContext>
            </div>
            {/* card footer */}
            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex w-14 h-[100px] gap-2 justify-center items-center 
                        bg-[#0D1117] border-2 rounded-md p-4 hover:text-rose-500 active:bg-black">
                            <Settings />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="flex gap-1 w-96">
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <p className="text-xs">Add Card</p>
                        <button 
                            className="flex w-12 justify-center items-center rounded-md
                            hover:text-rose-500 active:bg-black"
                            onClick={() => {
                                createCard(column.id)
                            }}
                        >
                            <PlusIcon />
                        </button>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <p className="text-xs">Color</p>
                        <div className="flex flex-row gap-1 items-center">
                            {solid.map((s) => (
                                <div key={s} style={{ background: s }}
                                    className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
                                    onClick={() => setBackground(s)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <p className="text-xs">Del Tier</p>
                        <button
                            onClick={() => {
                                deleteColumn(column.id)
                            }}
                            className="stroke-white rounded">
                                <TrashIcon />
                        </button>
                    </div>
                </PopoverContent>
            </Popover>

        </div>

    </div>
  )
}
