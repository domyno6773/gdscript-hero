# Build pinned major/minor Godot binary from the official 4.4.1 release.
# For production pin the base image digest and verify the official ZIP checksum.
FROM debian:bookworm-slim AS download
RUN apt-get update && apt-get install -y --no-install-recommends curl unzip ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN curl --fail --location --retry 4 \
    https://github.com/godotengine/godot-builds/releases/download/4.4.1-stable/Godot_v4.4.1-stable_linux.x86_64.zip \
    -o /tmp/godot.zip \
    && unzip -q /tmp/godot.zip -d /tmp \
    && mv /tmp/Godot_v4.4.1-stable_linux.x86_64 /tmp/godot \
    && chmod 555 /tmp/godot
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends libstdc++6 libgcc-s1 ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /opt/gdh /work
COPY --from=download /tmp/godot /usr/local/bin/godot
COPY project.godot grader.gd /opt/gdh/
USER 65534:65534
ENV HOME=/tmp
WORKDIR /opt/gdh
ENTRYPOINT ["/usr/local/bin/godot","--headless","--path","/opt/gdh","--script","res://grader.gd","--"]
