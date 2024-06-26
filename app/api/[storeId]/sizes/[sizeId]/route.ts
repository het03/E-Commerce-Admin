import primsadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: {sizeId: string} }
) {
    try{
        if(!params.sizeId){
            return new NextResponse("Size ID is required", { status: 400 });
        }

        const size = await primsadb.size.findUnique({
            where: {
                id: params.sizeId,
            },
        });

        return NextResponse.json(size);
    }
    catch (error){
        console.log('[SIZE_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string, sizeId: string} }
) {
    try{
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name){
            return new NextResponse("Label is required", { status: 400 });
        }

        if(!value){
            return new NextResponse("ImageUrl is required", { status: 400 });
        }

        if(!params.sizeId){
            return new NextResponse("Size ID is required", { status: 400 });
        }

        const storeByUsserId = await primsadb.store.findFirst({
            where: {
              id: params.storeId,
              userId
            },
          });
      
          if(!storeByUsserId){
              return new NextResponse("Unauthorized", { status: 403 });
          }

        const size = await primsadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size);
    }
    catch (error){
        console.log('[SIZE_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};


export async function DELETE (
    req: Request,
    { params }: { params: {storeId: string, sizeId: string} }
) {
    try{
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!params.sizeId){
            return new NextResponse("Size ID is required", { status: 400 });
        }

        const storeByUsserId = await primsadb.store.findFirst({
            where: {
              id: params.storeId,
              userId
            },
          });
      
          if(!storeByUsserId){
              return new NextResponse("Unauthorized", { status: 403 });
          }

        const size = await primsadb.size.deleteMany({
            where: {
                id: params.sizeId,
            },
        });

        return NextResponse.json(size);
    }
    catch (error){
        console.log('[SIZE_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

