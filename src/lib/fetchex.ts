export async function fetchWrapper<T>(endpoint: string): Promise<T> {
    const response = await fetch(endpoint);
    const body = await response.text();

    let parsedBody = undefined;
    try {
        parsedBody = JSON.parse(body);
    } catch {}

    if (!response.ok || !parsedBody) {
        console.error(body);
        if (parsedBody && parsedBody.error) {
            throw new Error(parsedBody.error);
        }
        throw new Error("An unknown error has occured");
    }

    return parsedBody;
}

export async function fetchPostWrapper<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const body = await response.text();

    let parsedBody = undefined;
    try {
        parsedBody = JSON.parse(body);
    } catch {}

    if (!response.ok || !parsedBody) {
        console.error(body);
        if (parsedBody && parsedBody.error) {
            throw new Error(parsedBody.error);
        }
        throw new Error("An unknown error has occured");
    }

    return parsedBody;
}
